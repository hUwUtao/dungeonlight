#! /bin/bash
cd runtime
function init(){
    [ ! -d build ] && mkdir build
    [ ! -d build/bin ] && mkdir build/bin
}
function getul(){
    cd include
    UL_PLATFORM="win"
    UL_VERSION="1.2.1"
    UL_FILE=ul.$UL_VERSION-$UL_PLATFORM.7z
    [ ! -e $UL_FILE ] && curl -L https://github.com/ultralight-ux/Ultralight/releases/download/v${UL_VERSION}/ultralight-sdk-${UL_VERSION}-${UL_PLATFORM}-x64.7z > ${$UL_FILE}
    7z x ${UL_FILE} -oultralight -y
    cd ..
}
function getla(){
    cd include
    LIBARCHIVE_VERSION="3.6.1"
    LIBARCHIVE_FILE=la-$LIBARCHIVE_VERSION.zip
    [ ! -e $LIBARCHIVE_FILE ] && curl -L https://github.com/libarchive/libarchive/releases/download/v${LIBARCHIVE_VERSION}/libarchive-v${LIBARCHIVE_VERSION}-amd64.zip > ${LIBARCHIVE_FILE}
    unzip ${LIBARCHIVE_FILE}
    cd ..
}
function cleanlib(){
    cd include
    ls | grep -v '.gitignore' | grep -v 'libdl' | xargs rm -r
    cd ..
}
function libdl(){
    echo ''
}
init
while test $# -gt 0
do
    case "$1" in
        clean) 
            echo /===== Clean build directory =====/
            [ -d build/bin ] && rm -rv build/bin
            cleanlib
            init
            ;;
        getul)
            getul
            ;;
        getla)
            getla
            ;;
        makedl)
            cd include/libdl/build
            # windows only =((
            powershell -c "devenv /build Release DungeonLightLib.sln"
            cd ../../..
            ;;
        copy) 
            echo /======= Copy Dependencies =======/
            cp -rv include/libdl/build/Release/*.dll build/bin -r
            cp -rv include/ultralight/bin/* build/bin -r
            cp -rv include/libarchive/bin/* build/bin -r
            [ ! -d build/bin/Debug ] && mkdir build/bin/Debug
            cp -rv build/bin/*.dll build/bin/Debug
            ;;
        dev)
            [ ! -d build/bin/assets ] && mkdir build/bin/assets
            [ ! -d build/bin/assets/inspector ] && mkdir build/bin/assets/inspector
            cp -rv include/ultralight/inspector/* build/bin/assets/inspector
            ;;
    esac
    shift
done
