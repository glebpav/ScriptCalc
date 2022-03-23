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

// todo this fun must connect with db
fun loadScriptData(id: Int): Script {
    // get scriptData from db for this id
    //
    return Script(
        id = 5,
        creatorID = 5,
        inputParams = listOf(
            Param("p", "pasc"), Param("t", "K")
        ),
        outputParams = listOf(
            Param("v", "m^3"), Param("h", "unk"), Param("u", "unk")
        ),
        name = "Stream",
        description = "big Description",
        path = "asd"
    )


}


// todo this fun must make request to Aram's service
// todo and must receive calculated outputs
fun makeCalculations(paramList: List<Param>?): List<Param> {

    /* .... */

    return listOf(
        Param("dd", "d", "77"),
        Param("aa", "a", "66"),
        Param("fs", "f", "11")
    )

}
