#!/bin/bash
#自动部署，自动重启系统
echo $1
git add .
if [[ "" != $1 ]]; then
	git commit -m $1
else
	git commit -m 'm'
fi
git push

