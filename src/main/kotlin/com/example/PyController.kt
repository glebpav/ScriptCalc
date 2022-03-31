package com.example

import java.io.*


object PyController {
    fun pycall(scriptPath: String, scriptParameters: List<String>): List<String> {
        val processBuilder = ProcessBuilder()
        processBuilder.command("python", scriptPath)
        val process = processBuilder.start()
        val writer = PrintWriter(OutputStreamWriter(BufferedOutputStream(process.outputStream)), true)
        for(param in scriptParameters) {
            writer.println(param)
        }
        writer.flush()
        writer.close()

        val output = mutableListOf<String>()
        BufferedReader(InputStreamReader(process.inputStream, "cp1251")).use { reader ->
            var line: String?
            while (reader.readLine().also { line = it } != null) {
                line?.let { output.add(it) }
            }
        }
        return output.toList()
    }
}