import React, { useLayoutEffect, useState } from 'react';

export default function useWindowSize(callback) {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([window.innerWidth, window.innerHeight]);
    }
    function updateOrCallback(){
      if(callback){
        callback();
      }else{
        updateSize();
      }
    }
    window.addEventListener('resize', updateOrCallback);

    return () => window.removeEventListener('resize', updateOrCallback);
  }, []);
  return size;
}
/*
function ShowWindowDimensions(props) {
  const [width, height] = useWindowSize();
  return <span>Window size: {width} x {height}</span>;
}*/