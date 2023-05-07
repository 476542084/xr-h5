#!/bin/bash

PKG_SERVERS=(
  "183.240.203.111"    #测试环境
)
DEFAULT_SERVER="183.240.203.111"
DEFAULT_PORT='22'
DEFAULT_ROOT='root'
TAR_DIR='/opt/digital-human'
TAR_NAME='digital-human.tar.gz'
DIST='./build'

echo "请选择要部署的服务器(序号)"
select SERVER in ${PKG_SERVERS[@]}; do
  break
done

if [ -n "$SERVER" ]; then
  DEFAULT_SERVER="$SERVER"
fi

echo "$DEFAULT_SERVER"

read -p "请输入端口(默认为"22")"
if [ -n "$REPLY" ]; then
  DEFAULT_PORT="$REPLY"
fi
echo "$DEFAULT_SERVER:$DEFAULT_PORT"

cd $DIST
tar -czf $TAR_NAME ./*
scp -P $DEFAULT_PORT $TAR_NAME $DEFAULT_ROOT@$DEFAULT_SERVER:$TAR_DIR
rm -f $TAR_NAME
ssh -p $DEFAULT_PORT $DEFAULT_ROOT@$DEFAULT_SERVER "cd $TAR_DIR && tar -xzf $TAR_NAME"
