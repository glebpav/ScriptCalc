package com.example

import io.ktor.server.engine.*
import io.ktor.server.netty.*
import com.example.plugins.*
import com.example.models.Param
import com.example.models.Script
import java.io.File

fun main() {
    if(!(File("invitecode.txt").exists())) {
        File("invitecode.txt").writeText("termoPhysics_g9xB*5")
    }
    embeddedServer(Netty, port = 8080, host = "0.0.0.0") {
        configureRouting()
        configureTemplating()
        configureSerialization()
    }.start(wait = true)
}
