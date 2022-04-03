package com.example.plugins

import com.example.PyController
import com.example.models.Param
import com.example.models.User
import io.ktor.server.routing.*
import io.ktor.http.*
import io.ktor.http.content.*
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.server.sessions.*
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import ru.tashchyan.Auth
import com.example.database.DbController
import kotlinx.serialization.decodeFromString
import java.io.File

fun Application.configureRouting() {

    install(Sessions) {
        cookie<User>("MY_SESSION") {
            cookie.extensions["SameSite"] = "lax"
        }
    }

    routing {

        static("/") {
            resources("files/htmls")
            resources("files")
        }

        get("/") {
            call.respondRedirect("/greeting.html")
        }

        get("/auth/check") {
            val token = call.request.queryParameters["token"].toString()
            val user = Auth.getUserByToken(token)
            if (user != null)
                call.respond(user)
            else
                call.response.status(HttpStatusCode(400, "You are not logged in"))
        }

        post("/auth/register") {
            val params = call.receiveParameters()
            val login = params["login"] ?: ""
            val password = params["password"] ?: ""
            val name = params["name"] ?: ""
            try {
                DbController.createUser(login, password, name)
                call.response.status(HttpStatusCode.OK)
            } catch (e: Exception) {
                call.response.status(HttpStatusCode(400, e.message.toString()))
            }
        }

        post("/auth/login") {
            val params = call.receiveParameters()
            val login = params["login"] ?: ""
            val password = params["password"] ?: ""
            try {
                val user = DbController.getUserByLoginAndPassword(login, password)
                if (user != null) {
                    val token = Auth.generateToken()
                    Auth.addNewSession(token, user)
                    call.response.cookies.append("token", token)
                    // call.respond(user)

                    // todo refactor this
                    call.respond(
                        message = "{\"user\": ${Json.encodeToString(user)}," +
                                " \"token\": \"${token}\"}"
                    )

                } else {
                    throw Exception("Wrong login or password")
                }
            } catch (e: Exception) {
                call.response.status(HttpStatusCode(400, e.message.toString()))
            }
        }

        post("auth/logout") {
            val token = call.request.cookies["token"].toString()
            val user = Auth.getUserByToken(token)
            if (user != null) {
                Auth.removeSession(token)
                call.response.status(HttpStatusCode.OK)
            } else
                call.response.status(HttpStatusCode(400, "You are not logged in"))
        }

        post("script/upload") {
            try {
                val token = call.request.queryParameters["token"] ?: throw Exception("You are not logged in")
                val user = Auth.getUserByToken(token) ?: throw Exception("You are not logged in")
                val creatorID = user.id
                var name = ""
                var description = ""
                var path = ""
                val inputParams = mutableListOf<Param>()
                val outputParams = mutableListOf<Param>()
                var fileBytes: ByteArray = byteArrayOf()
                val multipartData = call.receiveMultipart()

                multipartData.forEachPart { part ->
                    when (part) {
                        is PartData.FormItem -> {
                            if (part.name == "name")
                                name = part.value
                            if (part.name == "description")
                                description = part.value
                            if (part.name?.contains("inputParamsUnits") == true) {
                                val index = part.name!!.substringAfter("[").substringBefore("]").toInt()
                                inputParams[index].unit = part.value
                            } else if (part.name?.contains("inputParams") == true) {
                                val index = part.name!!.substringAfter("[").substringBefore("]").toInt()
                                val newParam = Param(0, 0, part.value, "", "input")
                                inputParams.add(newParam)
                            }
                            if (part.name?.contains("outputParamsUnits") == true) {
                                val index = part.name!!.substringAfter("[").substringBefore("]").toInt()
                                outputParams[index].unit = part.value
                            } else if (part.name?.contains("outputParams") == true) {
                                val index = part.name!!.substringAfter("[").substringBefore("]").toInt()
                                val newParam = Param(0, 0, part.value, "", "output")
                                outputParams.add(newParam)
                            }
                        }
                        is PartData.FileItem -> {
                            if (part.name == "file") {
                                val fileName = part.originalFileName as String
                                fileBytes = part.streamProvider().readBytes()
                            }
                        }
                        else -> {}
                    }
                }

                if(!(File("scripts").exists()))
                    File("scripts").mkdirs()
                path = "scripts/" + Auth.generateToken() + ".py";
                if (fileBytes.isNotEmpty()) File(path).writeBytes(fileBytes) else throw Exception("Empty script file")

                val newScriptID = DbController.createFile(creatorID, name, description, path)

                for(param in inputParams) {
                    DbController.addParameter(newScriptID, param.paramName, param.unit, "input")
                }
                for(param in outputParams) {
                    DbController.addParameter(newScriptID, param.paramName, param.unit, "output")
                }

                call.response.status(HttpStatusCode.OK)
            } catch (e: Exception) {
                call.response.status(HttpStatusCode(400, e.message.toString()))
            }
        }

        get("script/loadAll") {

            val token = call.request.queryParameters["token"] ?: return@get call.respondText(
                "You are not logged in",
                status = HttpStatusCode.BadRequest
            )

            val scripts = DbController.getAllScripts()

            call.respond(scripts)

        }

        post("script/calculate") {
            try {
                val params = call.receiveParameters()
                val scriptID = params["scriptID"]?.toInt() ?: throw Exception("Invalid script id")

                val scriptInputParams = Json.decodeFromString<List<Param>>(params["scriptInputParams"].toString())

                val script = DbController.getScriptByID(scriptID) ?: throw Exception("Can't find script with this id")

                val inputTextParams = mutableListOf<String>()
                scriptInputParams.forEach { inputTextParams.add(it.value) }

                val outputTextParams = PyController.pycall(script.path, inputTextParams.toList())
                if(outputTextParams.size != script.outputParams.size) throw Exception("Number of arguments returned by script is invalid")

                var i = 0
                while(i < script.outputParams.size) {
                    script.outputParams[i].value = outputTextParams[i]
                    i++
                }

                call.respond(script.outputParams)
            } catch (e: Exception) {
                call.response.status(HttpStatusCode(400, e.message.toString()))
            }
        }

        get("script/load") {
            try {
                val id = call.request.queryParameters["id"] ?: throw Exception("Empty ID")
                val script = DbController.getScriptByID(id.toInt()) ?: throw Exception("Plugin with this id not found")

                call.respond(script)

            } catch (e: Exception) {
                call.response.status(HttpStatusCode(400, e.message.toString()))
            }
        }

    }

}
