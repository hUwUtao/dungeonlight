project(URuntime)
set(APP_NAME URuntime)

cmake_minimum_required(VERSION 3.22)

if (EXISTS "${CMAKE_CURRENT_LIST_DIR}/../Deps.cmake")
    set(IN_SOURCE_BUILD 1)
    if (UNIX)
        if (APPLE)
            set(PORT UltralightMac)
        else ()
            set(PORT UltralightLinux)
        endif ()
    elseif (CMAKE_SYSTEM_NAME MATCHES "Windows")
        set(PORT UltralightWin)
    else ()
        message(FATAL_ERROR "Unknown OS '${CMAKE_SYSTEM_NAME}'")
    endif ()
    include(${CMAKE_CURRENT_LIST_DIR}/../Deps.cmake)
else ()
    set(IN_SOURCE_BUILD 0)
    set(SDK_ROOT "${CMAKE_CURRENT_LIST_DIR}/../")
endif ()

set(SDK_ROOT "include/ultralight")
set(ULTRALIGHT_BINARY_DIR "${SDK_ROOT}/bin")
set(ULTRALIGHT_INCLUDE_DIR "${SDK_ROOT}/include")
set(ULTRALIGHT_INSPECTOR_DIR "${SDK_ROOT}/inspector")
set(ULTRALIGHT_RESOURCES_DIR "${ULTRALIGHT_BINARY_DIR}/resources")

set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)
set(CMAKE_LIBRARY_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/lib)

if (CMAKE_SYSTEM_NAME MATCHES "Windows")
    set(ULTRALIGHT_LIBRARY_DIR "${SDK_ROOT}/lib")
else ()
    set(ULTRALIGHT_LIBRARY_DIR "${SDK_ROOT}/bin")
endif ()

if (PORT MATCHES "UltralightMac")
    SET(CMAKE_SKIP_BUILD_RPATH  FALSE)
    SET(CMAKE_BUILD_WITH_INSTALL_RPATH TRUE)
    SET(CMAKE_INSTALL_RPATH "@executable_path/")
endif ()

if (PORT MATCHES "UltralightLinux")
    SET(CMAKE_SKIP_BUILD_RPATH  FALSE)
    SET(CMAKE_BUILD_WITH_INSTALL_RPATH TRUE)
    SET(CMAKE_INSTALL_RPATH "$\{ORIGIN\}")
endif ()

set(ULTRALIGHT_LIBRARY_DIR "${SDK_ROOT}/lib")
set(LIB_DLGE "include/libdl/build/Release")
set(LIB_ARCHIVE "include/libarchive/lib")

include_directories("${ULTRALIGHT_INCLUDE_DIR}", "include/libarchive/include" "include/libdl/src" )
link_directories("${ULTRALIGHT_LIBRARY_DIR}/" "${LIB_DLGE}" "${LIB_ARCHIVE}")
link_libraries(UltralightCore AppCore Ultralight WebCore DungeonLight archive)

set(ICON_RESOURCE "${CMAKE_CURRENT_SOURCE_DIR}/../assets/br.rc" "main.h")

add_executable(${APP_NAME} WIN32 MACOSX_BUNDLE "main.cpp" "main.h")
target_sources(${APP_NAME} PRIVATE ${ICON_RESOURCE} "main.h")

if (APPLE)
  # Enable High-DPI on macOS through our custom Info.plist template
  set_target_properties(${APP_NAME} PROPERTIES MACOSX_BUNDLE_INFO_PLIST ${CMAKE_CURRENT_SOURCE_DIR}/Info.plist.in) 
endif()

if (MSVC)
  # Tell MSVC to use main instead of WinMain for Windows subsystem executables
  set_target_properties(${APP_NAME} PROPERTIES LINK_FLAGS "/ENTRY:mainCRTStartup")
endif()

# Copy all binaries to target directory
add_custom_command(TARGET ${APP_NAME} POST_BUILD
  #COMMAND ${CMAKE_COMMAND} -E copy_directory "${ULTRALIGHT_BINARY_DIR}/" $<TARGET_FILE_DIR:${APP_NAME}>)
  COMMAND ${CMAKE_COMMAND} -E copy_directory ../${ULTRALIGHT_BINARY_DIR} bin)

# Set the assets path to "/assets" or "/../Resources/assets" on macOS
if (APPLE)
  set(ASSETS_PATH "${ULTRALIGHT_BINARY_DIR}/../Resources/assets") 
else ()
  set(ASSETS_PATH "${ULTRALIGHT_BINARY_DIR}/assets") 
endif ()

# Copy resources to assets directory
add_custom_command(TARGET ${APP_NAME} POST_BUILD
  COMMAND ${CMAKE_COMMAND} -E copy_directory ../${ULTRALIGHT_RESOURCES_DIR} bin/resources)
