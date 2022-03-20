package ru.tashchyan.models

import kotlinx.serialization.Serializable

@Serializable
data class Param (
    val paramName: String,
    val unit: String,
    val value: String = ""
)