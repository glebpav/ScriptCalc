package ru.tashchyan

import com.example.models.User
import java.util.*
import kotlin.collections.LinkedHashSet

object Auth {
    //Набор всех открытых http сеансов пользователей. С каждым сеансом связан пользователь UserClient{userID, paramName}
    private val sessions = Collections.synchronizedSet<Session?>(LinkedHashSet())
    data class Session(val token: String, val user: User)

    //генерируем случайный токен
    fun generateToken(): String {
        return java.util.UUID.randomUUID().toString().replace("-", "")
    }
    //добавляем сеанс по токену и ассоциируем его с пользователем
    fun addNewSession(token: String, user: User) {
        sessions += Session(token, user)
    }
    //выполняем логаут сеанса с закрытием всех ws соединний связанных с ним
    suspend fun removeSession(token: String) {
        sessions.removeIf { it.token == token }
    }
    //получаем пользователя по токену сеанса (именно по нему методы api понимают залогинел ли пользователь)
    fun getUserByToken(token: String): User? {
        if (!sessions.any { it.token == token }) return null
        return sessions.single { it.token == token }.user
    }
}