import { useEffect, useReducer } from 'react';
import speakersReducer from './speakersReducer';
import axios from 'axios';

function useStateDataManager(){

  const [{ isLoading, speakerList, favoriteClickCount, hasErrored, error }, dispatch] = useReducer(speakersReducer, {
    isLoading: true,
    speakerList: [],
    favoriteClickCount: 0,
    hasErrored: false,
    error: null,
  });

  function incrementFavoriteClickCount() {
    dispatch({type: 'incrementFavoriteClickCount'});
  }

  function toggleSpeakerFavorite(speakerRec){
    const updateData = async function (){
      axios.put(`http://localhost:4000/speakers/${speakerRec.id}`, speakerRec);
      speakerRec.favorite === true ?
        dispatch({type: "unfavorite", id: speakerRec.id}) :
        dispatch({type: "favorite", id: speakerRec.id}) ;
    };
    updateData();
  }
  
  useEffect(() => {

    const fetchData = async function(){
      try{
        let result = await axios.get('http://localhost:4000/speakers');
        dispatch({ type: 'setSpeakerList', data: result.data });
      } catch(e){
        dispatch({type: 'errored', error: e});
      }
    };
    fetchData();
    return () => {
      console.log('cleanup');
    };
  }, []); // [speakingSunday, speakingSaturday]);
  return { isLoading, speakerList, favoriteClickCount, incrementFavoriteClickCount, toggleSpeakerFavorite, hasErrored, error };

};

export default useStateDataManager;
