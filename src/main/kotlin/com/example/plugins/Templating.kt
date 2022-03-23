package com.example.plugins

import com.example.loadScriptData
import com.example.models.Script
import io.ktor.http.*
import io.ktor.server.thymeleaf.Thymeleaf
import io.ktor.server.thymeleaf.ThymeleafContent
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver
import io.ktor.server.application.*
import io.ktor.server.http.content.*
import io.ktor.server.response.*
import io.ktor.server.request.*
import io.ktor.server.routing.*

fun Application.configureTemplating() {
    install(Thymeleaf) {
        setTemplateResolver(ClassLoaderTemplateResolver().apply {
            prefix = "templates/thymeleaf/"
            suffix = ".html"
            characterEncoding = "utf-8"
        })
    }


    routing {
        static("/processScript") {
            resources("templates.thymeleaf")
        }

        // execute script which id was written in query param
        // there is an id of each script in db (I hope)
        get("/processScript") {
            val id = call.request.queryParameters["id"] ?: return@get call.respond(HttpStatusCode.BadRequest)

                // todo this fun must connect with db
                val scriptData = loadScriptData(id.toInt())
            call.respond(ThymeleafContent("processScript", mapOf("script" to scriptData)))
        }
    }
}