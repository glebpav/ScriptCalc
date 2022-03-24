package ru.tashchyan.database

import com.example.models.User
import java.sql.DriverManager

object DbController {
    private const val dbHost = "89.108.78.211"
    private const val dbUser = "user"
    private const val dbPass = "V2X8i6JZ"
    private const val dbName = "termoPhysics"

    fun createUser(login: String, password: String, name: String) {
        if (!(login.length in 3..30))
            throw Exception("Login length should be from 3 to 30 characters")
        if (!(password.length in 3..255))
            throw Exception("Password length should be from 3 to 30 characters")
        if (!(name.length in 3..128))
            throw Exception("Name length should be from 3 to 30 characters")
        if (getUserByLogin(login) != null)
            throw Exception("User with this login has already registered")
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val insertAccountSql = "INSERT INTO Users (login, password, name) VALUES (?, ?, ?);"
        val queryInsertAccount = connection.prepareStatement(insertAccountSql)
        queryInsertAccount.setString(1, login)
        queryInsertAccount.setString(2, password)
        queryInsertAccount.setString(3, name)
        queryInsertAccount.execute()
        connection.close()
    }

    fun getUserByLoginAndPassword(login: String, password: String): User? {
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val getUsers = "SELECT * FROM Users WHERE login = ? AND password = ?;"
        val getUserQuery = connection.prepareStatement(getUsers)
        getUserQuery.setString(1, login)
        getUserQuery.setString(2, password)
        val result = getUserQuery.executeQuery()
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
        val getUsers = "SELECT * FROM Users WHERE login = ?;"
        val getUserQuery = connection.prepareStatement(getUsers)
        getUserQuery.setString(1, login)
        val result = getUserQuery.executeQuery()
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

    fun createFile(creatorID: Int, name: String, description: String, path: String): Int {
        if (!(name.length in 3..128))
            throw Exception("Script name length should be from 3 to 128 characters")
        if (!(description.length in 0..65535))
            throw Exception("Script description length should be from 0 to 65535 characters")
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val insertAccountSql = "INSERT INTO Scripts (creatorID, name, description, path) VALUES (?, ?, ?, ?);"
        val queryInsertAccount = connection.prepareStatement(insertAccountSql)
        queryInsertAccount.setInt(1, creatorID)
        queryInsertAccount.setString(2, name)
        queryInsertAccount.setString(3, description)
        queryInsertAccount.setString(4, path)
        queryInsertAccount.execute()

        val queryGetLastId = connection.createStatement();
        val result = queryGetLastId.executeQuery("SELECT LAST_INSERT_ID();");
        result.next()
        val lastId = result.getInt(1)

        connection.close()

        return lastId
    }

    fun addParameter(scriptID: Int, name: String, unit: String, type: String) {
        Class.forName("com.mysql.cj.jdbc.Driver")
        val connection = DriverManager.getConnection("jdbc:mysql://$dbHost/$dbName", dbUser, dbPass)
        val insertParamSql = "INSERT INTO Params (scriptID, name, unit, type) VALUES (?, ?, ?, ?);"
        val queryInsertAccount = connection.prepareStatement(insertParamSql)
        queryInsertAccount.setInt(1, scriptID)
        queryInsertAccount.setString(2, name)
        queryInsertAccount.setString(3, unit)
        queryInsertAccount.setString(4, type)
        queryInsertAccount.execute()
        connection.close()
    }
}