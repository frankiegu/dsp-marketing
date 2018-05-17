#!/usr/bin/env bash
set -v
cnpm run build
zip -r dist.zip dist/
scp dist.zip root@10.99.1.133:/opt/dist.zip
ssh root@10.99.1.133  'cd /opt/ && rm -rf dist && unzip dist.zip'
