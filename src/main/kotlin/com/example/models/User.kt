package com.example.models

import kotlinx.serialization.Serializable
import kotlinx.serialization.Transient

@Serializable
//password исключен из сериализации
data class User(
    val id: Int,
    val login: String,
    @Transient val password: String = "",
    val name: String)