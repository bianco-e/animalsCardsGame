import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import HandsContext, {
  IHandsContext,
  IHandsState,
} from "../context/HandsContext";
import { SET_CARDS } from "../context/HandsContext/types";
import { HandKey, ITerrain } from "../interfaces";
import { newRandomGame, newTerrain, saveGameResult } from "../queries/games";
import { getCookie } from "../utils";
import AvatarWithXpBar from "./AvatarWithXpBar";
import Spinner from "./Spinner";
import { ACButton, ModalTitle, Text } from "./styled-components";

const getXpToEarn = (current: number): number => {
  switch (current) {
    case 0:
      return 300;
    case 300:
      return 300;
    case 600:
      return 400;
    default:
      return 1000;
  }
};

interface IProps {
  closeModal: () => void;
  currentXp?: number;
  isCampaignGame: boolean;
  modal: string;
  setTerrain: (terrain: ITerrain) => void;
}
export default function ModalResultContent({
  closeModal,
  currentXp,
  isCampaignGame,
  modal,
  setTerrain,
}: IProps) {
  const [state, dispatch] = useContext<IHandsContext>(HandsContext);
  const [isLoadingNewGame, setisLoadingNewGame] = useState<boolean>(false);
  const [havingXp, setHavingXp] = useState<number>(0);
  const history = useHistory();

  const getStatsToSaveGame = (
    authId: string,
    won: boolean,
    state: IHandsState
  ): void => {
    const mapCardsToSave = (handKey: HandKey) =>
      state.hands[handKey].map((card) => ({
        name: card.name,
        survived: card.life.current !== "DEAD",
      }));
    const mapPlantsToSave = (handKey: HandKey) =>
      state.plants[handKey].map((plant) => {
        const wasApplied = state.usedPlants.find((pl) => pl.name === plant.name)
          ? true
          : false;
        return {
          name: plant.name,
          applied: wasApplied,
        };
      });

    const xpToEarn: number =
      currentXp !== undefined ? getXpToEarn(currentXp) : 0;

    const gameToSave = {
      created_at: new Date().getTime().toString(),
      terrain: state.terrainName!,
      xp_earned: xpToEarn,
      won,
      usedAnimals: {
        pc: mapCardsToSave("pc"),
        user: mapCardsToSave("user"),
      },
      usedPlants: {
        pc: mapPlantsToSave("pc"),
        user: mapPlantsToSave("user"),
      },
    };

    saveGameResult(authId, gameToSave).then((res) => {
      if (res && res.xp !== undefined) {
        setHavingXp(res.xp);
      }
    });
  };

  useEffect(() => {
    const authId = getCookie("auth=");
    if (isCampaignGame && authId) {
      getStatsToSaveGame(authId, modal === "win", state);
    }
  }, []); //eslint-disable-line

  const handlePlayAgain = () => {
    setisLoadingNewGame(true);
    newTerrain().then((terrainRes) => {
      if (terrainRes && terrainRes.name) {
        setTerrain(terrainRes);
        newRandomGame().then((gameRes) => {
          if (gameRes && gameRes.pc && gameRes.user) {
            setisLoadingNewGame(false);
            closeModal();
            dispatch({
              type: SET_CARDS,
              hands: { pc: gameRes.pc.animals, user: gameRes.user.animals },
              plants: { pc: gameRes.pc.plants, user: gameRes.user.plants },
              terrain: terrainRes,
            });
          }
        });
      }
    });
  };

  return (
    <>
      {modal === "win" ? (
        <>
          <ModalTitle>You won!</ModalTitle>
          <Text margin={isCampaignGame ? "0 0 20px 0" : "0"}>
            Good game! Nature always win against computers!
          </Text>
        </>
      ) : (
        modal === "lose" && (
          <>
            <ModalTitle>You lost!</ModalTitle>
            <Text margin={isCampaignGame ? "0 0 20px 0" : "0"}>
              Nice try! PC defeated you this time, but nature always takes
              revenge!
            </Text>
          </>
        )
      )}
      {isCampaignGame ? (
        <>
          <AvatarWithXpBar havingXp={havingXp} />
          <ACButton margin="20px 0" onClick={() => history.push("/campaign")}>
            Go to campaign menu
          </ACButton>
        </>
      ) : (
        <>
          {isLoadingNewGame ? (
            <Spinner />
          ) : (
            <>
              <ACButton margin="10px 0 5px 0" onClick={handlePlayAgain}>
                Play again
              </ACButton>
              <ACButton margin="5px 0" onClick={() => history.push("/")}>
                Go to menu
              </ACButton>
            </>
          )}
        </>
      )}
    </>
  );
}