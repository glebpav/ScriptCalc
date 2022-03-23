package com.example.plugins

import com.example.models.User
import io.ktor.client.statement.*
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
import ru.tashchyan.database.DbController
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

        static("/processScript") {
            resources("files")
        }

        get("/") {
            call.respondText("Hello World!")
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
            val token = call.request.cookies["token"].toString()
            val user = Auth.getUserByToken(token)
            try {
                if (user == null) throw Exception("You are not logged in")
                val creatorID = user.id
                var name = ""
                var description = ""
                var path = ""
                var fileBytes: ByteArray = byteArrayOf()
                val multipartData = call.receiveMultipart()
                multipartData.forEachPart { part ->
                    when (part) {
                        is PartData.FormItem -> {
                            if (part.name == "name")
                                name = part.value
                            if (part.name == "description")
                                description = part.value
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
                path = "scripts/" + Auth.generateToken() + ".py";
                DbController.createFile(creatorID, name, description, path)
                if (fileBytes.isNotEmpty())
                    File(path).writeBytes(fileBytes)
                else
                    throw Exception("Empty script file")
                call.response.status(HttpStatusCode.OK)
            } catch (e: Exception) {
                call.response.status(HttpStatusCode(400, e.message.toString()))
            }
        }

    }
}
