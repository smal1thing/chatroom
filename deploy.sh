#!/bin/bash
source ~/.bashrc

echo "部署到oss生产环境"

echo "删除oss bucket内所有数据"
ossutilmac64 rm oss://platypus-test/ -a -r

echo "打包"
npm run build

echo "上传文件至 oss bucket"
ossutilmac64 cp -r build/ oss://platypus-test/
