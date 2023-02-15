import moment from 'moment';
import { BoostButton } from 'myboostpow-lib';
import React, { useEffect, useState } from 'react';

import { toast } from 'react-hot-toast';

import UserIcon from './UserIcon';
import OnchainEvent from './OnChainEvent';

import Twetch from './Twetch';
import { useRouter } from 'next/router';
import { useTheme } from 'next-themes';
import RelayClub from './RelayClub';
import PostMedia from './PostMedia';
import Linkify from 'linkify-react';
const Markdown = require('react-remarkable')

const RemarkableOptions = {
    breaks: true,
    html: true,
    typographer: true,
    /* highlight: function (str: any, lang: any) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value;
        } catch (err) {}
      }
  
      try {
        return hljs.highlightAuto(str).value;
      } catch (err) {}
  
      return ''; // use external default escaping
    } */
}

export const BFILE_REGEX = /b:\/\/([a-fA-F0-9]{64})/g;

export interface Ranking {
    content_txid: string;
    content_text?: string;
    content_type?:string;
    count?: number;
    difficulty?: number;
    createdAt?: Date;
}

const BoostContentCard = ({ content_txid, content_type, content_text, count, difficulty, createdAt }: Ranking) => {
    const author = null 
    const [isTwetch, setIsTwetch] = useState(false)
    const [isClub, setIsClub] = useState(false)
    const router = useRouter()
    const theme = useTheme()

    const handleBoostLoading = () => {
        toast('Publishing Your Boost Job to the Network', {
            icon: '⛏️',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
          });
      };
    
      const handleBoostSuccess = () => {
        toast('Success!', {
            icon: '✅',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
          });
      };
    
      const handleBoostError = () => {
        toast('Error!', {
            icon: '🐛',
            style: {
            borderRadius: '10px',
            background: '#333',
            color: '#fff',
            },
        });
      };

    const PostContent = () => {
        return (
            <>
            {content_type?.match('image') && (
                content_text ? <img src={`data:image/jpeg;base64,${content_text}`} className="w-full h-full rounded-lg"/> : <PostMedia files={[content_txid]}/>
            )}
            {content_type?.match('text/plain') && (
                <div className='mt-1 text-gray-900 dark:text-white text-base leading-6 whitespace-pre-line break-words'><Linkify options={{target: '_blank' , className: 'linkify-hover'}}>{content_text}</Linkify></div>
            )}
            {content_type?.match('markdown') && (
                <article className='prose dark:prose-invert prose-a:text-blue-600 break-words'>
                    <Markdown options={RemarkableOptions} source={content_text!.replace(BFILE_REGEX, `https://dogefiles.twetch.app/$1`)}/>
                </article>
            )}
            <OnchainEvent txid={content_txid}/>
            </>
        )
        
    }

    const navigate = (e: any) => {
        e.stopPropagation()
        router.push(`/${content_txid}`)
    }


  return (
    <div onClick={navigate} className='grid grid-cols-12 bg-primary-100 dark:bg-primary-600/20 hover:sm:bg-primary-200 hover:dark:sm:bg-primary-500/20 mt-0.5 first:md:rounded-t-lg last:md:rounded-b-lg'>
        <Twetch setIsTwetch={setIsTwetch} txid={content_txid} difficulty={difficulty || 0}/>
        <RelayClub setIsClub={setIsClub} txid={content_txid} difficulty={difficulty || 0}/>
        {!(isTwetch || isClub) && <div className='col-span-12'>
            <div className="mb-0.5 px-4 pt-4 pb-1 grid items-start grid-cols-12 max-w-screen cursor-pointer">
                {author && (
                    <div className='col-span-1'>
                        <a>
                            <UserIcon src={"https://a.relayx.com/u/anon@relayx.com"} size={46}/>
                        </a>
                    </div>
                )}
                <div className={`col-span-${author? 11 : 12} ml-6`}>
                       <div className='flex'>
                            {author && (
                            <div 
                                onClick={(e:any) => e.stopPropagation()}
                                className="text-base leading-4 font-bold text-gray-900 dark:text-white cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis hover:underline"
                            >
                                1anon
                            </div>
                            )}
                            <div className='grow'/>
                            <a  onClick={(e:any)=>e.stopPropagation()}
                                target="_blank"
                                rel="noreferrer"
                                href={`https://whatsonchain.com/tx/${content_txid}`}
                                className="text-xs leading-5 whitespace-nowrap text-gray-500 dark:text-gray-300 hover:text-gray-700 hover:dark:text-gray-500"
                            >
                                {/* {moment(createdAt).fromNow()} */}
                                txid
                            </a>

                        </div>
                    <PostContent/>
                    <div className='flex w-full px-16'>
                        <div className='grow'/>
                        <BoostButton
                            content={content_txid}
                            difficulty={difficulty || 0}
                            //@ts-ignore
                            theme={theme.theme}
                            showDifficulty
                            onSending={handleBoostLoading}
                            onError={handleBoostError}
                            onSuccess={handleBoostSuccess}
                        />
                    </div>
                </div> 
            </div>
        </div>}
    </div>
  )
}

export default BoostContentCard