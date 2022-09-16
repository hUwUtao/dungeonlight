#include <archive.h>
#include "libdl.h"

void libdlge_test()
{
    "hello world";
}

class Unpacker {
    struct archive* archive = archive_read_new();
public:
    Unpacker();
    int Unpacker::unpack(const char* filename);
};

Unpacker::Unpacker() {
    archive_read_support_compression_bzip2(archive);
    archive_read_support_format_tar(archive);
}

int Unpacker::unpack(const char* filename)
{
    archive_read_open_filename(archive, filename, 1024 * 1024 * 512);
    return 0;
}
