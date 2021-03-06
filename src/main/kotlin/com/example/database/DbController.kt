package com.example.database

import com.example.models.Param
import com.example.models.Script
import com.example.models.User
import java.sql.DriverManager

object DbController {
    private const val dbHost = "89.108.78.211"
    private const val dbUser = "user"
    private const val dbPass = "V2X8i6JZ"
    private const val dbName = "termoPhysics"

    fun createUser(login: String, password: String, name: String) {
        if (!(login.length in 3..30)) throw Exception("Login length should be from 3 to 30 characters")
        if (!(password.length in 3..255)) throw Exception("Password length should be from 3 to 30 characters")
        if (!(name.length in 3..128)) throw Exception("Name length should be from 3 to 30 characters")
        if (getUserByLogin(login) != null) throw Exception("User with this login has already registered")
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val sql = "INSERT INTO Users (login, password, name) VALUES (?, ?, ?);"
        val stmt = connection.prepareStatement(sql)
        stmt.setString(1, login)
        stmt.setString(2, password)
        stmt.setString(3, name)
        stmt.execute()
        connection.close()
    }

    fun getUserByLoginAndPassword(login: String, password: String): User? {
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val sql = "SELECT * FROM Users WHERE login = ? AND password = ?;"
        val stmt = connection.prepareStatement(sql)
        stmt.setString(1, login)
        stmt.setString(2, password)
        val result = stmt.executeQuery()
        var output: User? = null
        while (result.next()) {
            val getUserID = result.getInt(1)
            val getLogin = result.getString(2)
            val getPassword = result.getString(3)
            val getName = result.getString(4)
            output = User(getUserID, getLogin, getPassword, getName)
        }
        connection.close()
        return output
    }

    fun getUserByLogin(login: String): User? {
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val sql = "SELECT * FROM Users WHERE login = ?;"
        val stmt = connection.prepareStatement(sql)
        stmt.setString(1, login)
        val result = stmt.executeQuery()
        var output: User? = null
        while (result.next()) {
            val getUserID = result.getInt(1)
            val getLogin = result.getString(2)
            val getPassword = result.getString(3)
            val getName = result.getString(4)
            output = User(getUserID, getLogin, getPassword, getName)
        }
        connection.close()
        return output
    }

    fun createScript(creatorID: Int, name: String, description: String, path: String, type: String): Int {
        if (name.length !in 3..128) throw Exception("Script name length should be from 3 to 128 characters")
        if (description.length !in 0..65535) throw Exception("Script description length should be from 0 to 65535 characters")
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val sql = "INSERT INTO Scripts (creatorID, name, description, path, type) VALUES (?, ?, ?, ?, ?);"
        val stmt = connection.prepareStatement(sql)
        stmt.setInt(1, creatorID)
        stmt.setString(2, name)
        stmt.setString(3, description)
        stmt.setString(4, path)
        stmt.setString(5, type)
        stmt.execute()

        val stmt2 = connection.createStatement()
        val result = stmt2.executeQuery("SELECT LAST_INSERT_ID();")
        result.next()
        val lastId = result.getInt(1)

        connection.close()

        return lastId
    }

    fun deleteScript(scriptID: Int) {
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val sql = "DELETE FROM Params WHERE scriptID = ?;"
        val stmt = connection.prepareStatement(sql)
        stmt.setInt(1, scriptID)
        stmt.execute()
        val sql2 = "DELETE FROM Scripts WHERE id = ?;"
        val stmt2 = connection.prepareStatement(sql2)
        stmt2.setInt(1, scriptID)
        stmt2.execute()
        connection.close()
    }

    fun addParameter(scriptID: Int, name: String, unit: String, type: String) {
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val sql = "INSERT INTO Params (scriptID, paramName, unit, type) VALUES (?, ?, ?, ?);"
        val stmt = connection.prepareStatement(sql)
        stmt.setInt(1, scriptID)
        stmt.setString(2, name)
        stmt.setString(3, unit)
        stmt.setString(4, type)
        stmt.execute()
        connection.close()
    }

    fun getAllScripts(type: String): List<Script> {
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val sql = "SELECT * FROM Scripts WHERE type = ?;"
        val stmt = connection.prepareStatement(sql)
        stmt.setString(1, type)
        val result = stmt.executeQuery()
        val output = mutableListOf<Script>()
        while (result.next()) {
            val _getScriptID = result.getInt(1)
            val _getScriptCreatorID = result.getInt(2)
            val _getScriptName = result.getString(3)
            val _getScriptDescription = result.getString(4)
            val _getScriptPath = result.getString(5)
            val _getScriptType = result.getString(6)
            val _getScriptParams = getScriptParams(_getScriptID)
            output.add(
                Script(
                    _getScriptID,
                    _getScriptCreatorID,
                    _getScriptName,
                    _getScriptDescription,
                    _getScriptParams.filter { it.type == "input" },
                    _getScriptParams.filter { it.type == "output" },
                    _getScriptPath,
                    _getScriptType
                )
            )
        }
        connection.close()
        return output.toList()
    }


    fun getScriptByID(id: Int): Script? {
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val sql = "SELECT * FROM Scripts WHERE id = ?;"
        val stmt = connection.prepareStatement(sql)
        stmt.setInt(1, id)
        val result = stmt.executeQuery()
        var output: Script? = null
        while (result.next()) {
            val _getScriptID = result.getInt(1)
            val _getScriptCreatorID = result.getInt(2)
            val _getScriptName = result.getString(3)
            val _getScriptDescription = result.getString(4)
            val _getScriptPath = result.getString(5)
            val _getScriptType = result.getString(6)
            val _getScriptParams = getScriptParams(_getScriptID)
            output = Script(
                    _getScriptID,
                    _getScriptCreatorID,
                    _getScriptName,
                    _getScriptDescription,
                    _getScriptParams.filter { it.type == "input" },
                    _getScriptParams.filter { it.type == "output" },
                    _getScriptPath,
                    _getScriptType
                )
        }
        connection.close()
        return output
    }

    fun getScriptParams(scriptID: Int): List<Param> {
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val sql = "SELECT * FROM Params WHERE scriptID = ?;"
        val stmt = connection.prepareStatement(sql)
        stmt.setInt(1, scriptID)
        val result = stmt.executeQuery()
        val output = mutableListOf<Param>()
        while (result.next()) {
            val getParamID = result.getInt(1)
            val getParamScriptID = result.getInt(2)
            val getParamName = result.getString(3)
            val getParamUnit = result.getString(4)
            val getParamType = result.getString(5)
            output.add(Param(getParamID, getParamScriptID, getParamName, getParamUnit, getParamType))
        }
        connection.close()
        return output.toList()
    }
}