project(DungeonLightLib DESCRIPTION "Miscellaneous library for the game")

set(LIB_NAME DungeonLight)
set(LIB_VER 1.0.0)
cmake_minimum_required(VERSION 3.22)

SET(CMAKE_WINDOWS_EXPORT_ALL_SYMBOLS ON)


# set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
# set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)
include_directories(${CMAKE_CURRENT_SOURCE_DIR}/include "../libarchive/include")

add_library(${LIB_NAME} SHARED
    src/libdl.cpp
    src/libdl.h
)
set_target_properties(${LIB_NAME} PROPERTIES VERSION ${LIB_VER})
set_target_properties(${LIB_NAME} PROPERTIES SOVERSION ${LIB_VER})
set_target_properties(${LIB_NAME} PROPERTIES PUBLIC_HEADER src/main.h)
