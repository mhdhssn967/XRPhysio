import React, { useEffect, useState } from 'react';
import Backdrop from '@mui/material/Backdrop';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { fetchGameDetails, updateSessionGameInfo } from '../firebase/helpers';
import './GameModal.css'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: 800,
  bgcolor: 'var(--background-color)',
  border: '2px solid #000',
  borderRadius:'10px',
  boxShadow: 24,
  p: 4,
  maxHeight:'80vh',
  overflowY:'scroll'
};

const GameModal = ({open,setOpen,handleOpen,handleClose,user,setSelectedGame,selectedDeviceId,setTriggerRefresh, triggerRefresh}) => {
        const [allGames,setAllGames]=useState([])
    
  
       useEffect(() => {
            const getGamesDetails = async () => {
                const gamesRef=await fetchGameDetails()
                setAllGames(gamesRef)
            }; getGamesDetails(user);
        }, [])
  
  const handleGameStart=async(game)=>{
    console.log(user,selectedDeviceId,game.gameName,game.gameDisplayName);
    
    if(user,selectedDeviceId,game.gameName,game.gameDisplayName){
    await updateSessionGameInfo(user,selectedDeviceId,game.gameDisplayName,game.gameName)
    setTriggerRefresh(!triggerRefresh)
  handleClose()
  }
    
    else{
      console.log("Missing parameters");
      
    }
    
  }

  return (
    <div className='game-modal'>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
          },
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h5" component="h2">
              Chose a game
            </Typography>
            <div >   
            
                  <div className='game-modal-main-div'>
                      {Object.entries(
                        allGames
                          ?.filter(game => game.gameName !== "ActivitySelection")
                          ?.reduce((groups, game) => {
                            const key = game.focus || "Other";
                            if (!groups[key]) groups[key] = [];
                            groups[key].push(game);
                            return groups;
                          }, {})
                      ).map(([focus, games]) => (
                        <div key={focus} className="games-modal-div">
                          <h2 className='game-modal-heading'>{focus}</h2>
                          <div className='games-modal-items'>
                              {games.map((game, index) => (
                                <div key={game.gameName || index} className="modal-game-item">
                                  <button onClick={()=>handleGameStart(game)} className="game-modal-button">{game.gameDisplayName}</button>
                                </div>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
               
            
            
                </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};

export default GameModal;
