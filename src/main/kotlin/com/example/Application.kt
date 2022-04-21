package com.example

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import com.example.plugins.*
import com.example.models.Param
import com.example.models.Script

fun main() {
    embeddedServer(Netty, port = 8080, host = "localhost") {
        configureRouting()
        configureTemplating()
        configureSerialization()
    }.start(wait = true)
}
