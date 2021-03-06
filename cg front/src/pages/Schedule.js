import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';

import {GlobalContext} from '../state/context/globalStateContext';

import Tamplate from '../components/Tamplate'
import useMobile from 'hooks/useMobile'
import styles from '../styles/pages/Schedule.module.css';

import { sortSchedule } from '../utils';


const GetDate = ({date}) => {
    if(date){
        const time = new Date(date);
        const month =   (time.getMonth() + 1) < 10 ? `0${time.getMonth() + 1}` : `${time.getMonth() + 1}`;
        const day =     time.getDate();
        const hour =    time.getHours() < 10 ? `0${time.getHours()}` : `${time.getHours()}`;
        const minutes = time.getMinutes() < 10 ? `0${time.getMinutes()}` : `${time.getMinutes()}`;
        return `${hour}:${minutes}`
    }
    return null;
}


const TimeScale = ({sortedSchedule, currentTime}) => {

    const getStyle = (index) => {
        if( currentTime === index ) return styles.isCurrent;
        if( currentTime - index === 3) return styles.theSmallest;
        if( currentTime - index === 2) return styles.isSmall;
        if( currentTime - index === 1) return styles.isSmaller;
        else{
            if( index - currentTime === 3) return styles.theSmallest;
            if( index - currentTime === 2) return styles.isSmall;
            if( index - currentTime === 1) return styles.isSmaller;
            else return styles.empty;
        }
    }

    return (
        <>
            {sortedSchedule.map(( item, index) => (
                <>
                    
                    {item.custom ? 
                    <div key={index} className={getStyle(index)}>
                        <div> 
                            ...
                        </div>
                    </div>
                    :
                    <div key={item.id} className={getStyle(index)}>
                        <div style={{display:'flex', alignItems:'center'}}> 
                        
                            { currentTime === index ? '[' : ''}
                            
                                <div>
                                    <GetDate date={item?.date_time}/>
                                </div>
                                
                                <div style={{marginLeft: '20px'}}> 
                                    {item?.title}
                                </div>
                            
                            { currentTime === index ? ']' : ''}
                        
                        </div>
                    </div>}
                </>
            ))} 
        </>
    );
};

export default function Schedule() {
    const { globalState } = useContext(GlobalContext);

    const isMobile = useMobile();

    const [currentTime, setCurrentTime] = useState(3);

    const { schedule } = globalState;

    let sortedSchedule = [...schedule].sort(sortSchedule);
    sortedSchedule = [{custom:true},{custom:true},{custom:true}, ...sortedSchedule, {custom:true},{custom:true},{custom:true},]

    const handleWhell = (e) => {
        if(currentTime === 3 && e.deltaY < 0) return null;
        if(currentTime === sortedSchedule.length - 4 && e.deltaY > 0) return null;
        else{
            if(e.deltaY > 0) setCurrentTime(currentTime + 1);
            else setCurrentTime(currentTime + -1);
        }
    };

    const handleClick = (direction) => {
        if(currentTime === 3 && direction === 'down') return null;
        if(currentTime === sortedSchedule.length - 4 && direction === 'up') return null;
        else{
            if(direction === 'up') setCurrentTime(currentTime + 1);
            else setCurrentTime(currentTime + -1);
        }
    }

    const timeDiffrent = new Date () -  new Date(sortedSchedule[currentTime]?.date_time);

    const time = new Date(sortedSchedule[currentTime]?.date_time);
    const month =   (time.getMonth() + 1) < 10 ? `0${time.getMonth() + 1}` : `${time.getMonth() + 1}`;
    const day =     time.getDate();


    return (
        <>
            <Tamplate>
                <div onWheel={handleWhell} className={styles.wrapper}>
                    <div className={styles.title}>???????????????????? ?????????????? ???????????? ?????????????? ????????????????</div>

                    <div className={styles.timeWrapper}>

                        <div className={styles.target}>
                            <div>
                                {timeDiffrent < 3600000 && timeDiffrent > 0 ? '?????????? ???????????? ????????' : 
                                new Date(sortedSchedule[currentTime]?.date_time) > new Date() ? `?????? ??????????????` : "?????? ????????????"}
                            </div>
                            <div>
                                ???????? ?????????????? {month}.{day}
                            </div>
                        </div> 

                        <div className={styles.timeScale}>
                            <TimeScale sortedSchedule={sortedSchedule} currentTime={currentTime}/>
                        </div>

                    </div>

                    {isMobile ? 
                    <div>
                        <Button
                            classes={{root: styles.btn}}
                            onClick={() => {handleClick('down')}}
                        >
                            <ArrowUpwardIcon/>
                        </Button>
                        <Button
                            classes={{root: styles.btn}}
                            onClick={() => {handleClick('up')}}
                        >
                            <ArrowDownwardIcon/>
                        </Button>
                    </div> : null}

                    <Link style={{textDecoration:'none'}} to='/StaticSchedule'>
                            <Button
                                classes={{root: styles.btn}}
                            >
                                ???????????????? ?????? ????????????????????
                            </Button>   
                    </Link>

                </div>
            </Tamplate>
        </>
    )
}
