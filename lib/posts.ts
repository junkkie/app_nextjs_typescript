import fs from 'fs'
import matter from 'gray-matter';
import path from 'path'
import { remark } from 'remark';
import html from 'remark-html'


const postsDirectory = path.join(process.cwd(),'posts')

console.log('process.cwd()--->', process.cwd());
console.log('postsDirectory ------>', postsDirectory);

export function getSortedPostsData(){
  const fileNames = fs.readdirSync(postsDirectory); //동기식Sync, 비동기식async
  console.log('filenames-->', fileNames)

  const allPostsData = fileNames.map(fileName => {
    const id = fileName.replace(/\.md/ ,'' );
      //id = 'pre-rendering'
    const fullPath = path.join(postsDirectory, fileName)
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);
    console.log('matterResult', matterResult)
    return {
      id,
      ...(matterResult.data as {date:string, title:string})
    }
  });

  return allPostsData.sort((a,b) => {
    if(a.date < b.date) {
      return 1;
    }else{
      return -1;
    }
  })
}

export function getAllPostIds(){
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(fileName => {
    return{
      params:{
        id: fileName.replace(/\.md$/,'' )      //id = 'pre-rendering'         id='ssg-ssr'
      }
    }
  })
}

export async function getPostData(id:string) {
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8'); //node.js에서 사용, md파일 읽어들이기
  const matterResult = matter(fileContents); //객체로 변환
  const processedContent = await remark() //remark는 markdown을 html로 변환
                                .use(html)
                                .process(matterResult.content) 
  const contentHtml = processedContent.toString(); //문자열로 바굼
  return {
    id,
    contentHtml,
    ...(matterResult.data as {date:string, title:string})
  }
}