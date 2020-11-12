#! /bin/bash 

docpad clean

docpad generate --env static

s3cmd sync out/ s3://UPDATE-THE-URL!!!!.butterfill.com --add-header "Cache-Control: max-age=86400"
