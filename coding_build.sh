#vue构建脚本，命令根据项目与所选镜像(npm镜像无法使用cnpm命令)修改
#浏览器兼容判断
git clone https://e.coding.net/xiaoe/xiaoereleaseorder/scripts.git
chmod -R 777 ./scripts
PROJECT_PATH=$WORKSPACE node ./scripts/cdn/check.js 
if [ -f "check-msg.txt" ]; 
then 
  cat check-msg.txt
  throw error
else
  npm config set registry=http://111.230.199.61:6888/
  npm install
  npm run build:pro
  mkdir ${TAG_NAME}
  #此处静态资源包名由项目决定，多个静态资源包请执行多次拷贝
  rsync -a ./dist $TAG_NAME
  touch ${TAG_NAME}/version.txt
  echo "当前tag为：$TAG_NAME, 当前commitid为：$GIT_COMMIT， 当前提交人为：$GIT_COMMITTER_NAME, 当前所在分支为：$GIT_BRANCH" > $TAG_NAME/version.txt
  zip -q -r $TAG_NAME.zip $TAG_NAME/
fi
