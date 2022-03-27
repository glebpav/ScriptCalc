package com.example.models

import kotlinx.serialization.Serializable

@Serializable
data class Param (
    val id: Int,
    val scriptID: Int,
    var paramName: String,
    var unit: String,
    val type: String,
    var value: String = "",
)