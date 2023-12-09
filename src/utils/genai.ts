import { AxiosError } from 'axios';
import OpenAI from "openai"

const ACCESS_KEY = process.env.NEXT_PUBLIC_OPEN_AI_KEY as string

function timeout(delay: number) {
  return new Promise( res => setTimeout(res, delay) );
}

export const getImages = async (query: string) => {

  //temporary
  // await timeout(2000)
  // return ['/images/b1.png', '/images/b2.png', '/images/b3.png', '/images/b4.png', '/images/b5.png', '/images/b6.png', '/images/b7.png', '/images/b8.png']

  try {
      const openai = new OpenAI({
        apiKey: ACCESS_KEY,
        dangerouslyAllowBrowser: true,
    });
      const response = await openai.images.generate({
          prompt: query,
          n: 3,
          size: "512x512",
      });
      console.log('result', response.data);
      return response.data;
  } catch (error) {
      throw new Error((error as AxiosError).message)
      // await timeout(2000)
      // return ['/images/b1.png', '/images/b2.png', '/images/b3.png', '/images/b4.png', '/images/b5.png', '/images/b6.png', '/images/b7.png', '/images/b8.png']
  }

}