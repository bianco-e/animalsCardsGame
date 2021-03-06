import { useContext, useState } from "react";
import styled from "styled-components";
import HandsContext from "../context/HandsContext";
import { SELECT_PLANT } from "../context/HandsContext/types";
import { IPlant } from "../interfaces";
import {
  LARGE_RESPONSIVE_BREAK,
  MEDIUM_RESPONSIVE_BREAK,
} from "../utils/constants";
import PlantTooltip from "./PlantTooltip";
import { selectionAnimation } from "../animations/card-animations";

export default function Plant({ plant }: { plant: IPlant }) {
  const [showTooltip, setShowTooltip] = useState<boolean>(false);
  const [state, dispatch] = useContext(HandsContext);
  const { selectedPlant, pcTurn, usedPlants, plants } = state;
  const { name, description, image, appliable_on } = plant;
  const isPlantSelected = selectedPlant?.name === name;
  const plantBelongsToUser = !!plants.user.find(
    (pl: IPlant) => pl.name === name
  );
  return (
    <PlantContainer>
      {showTooltip && (
        <PlantTooltip
          appliableOn={appliable_on}
          description={description}
          belongsToUser={plantBelongsToUser}
        />
      )}
      <PlantCard
        onClick={() => {
          !pcTurn &&
            !usedPlants.includes(plant) &&
            dispatch({ type: SELECT_PLANT, plant });
        }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        opacity={usedPlants.includes(plant) ? "0.6" : "1"}
        belongsToUser={plantBelongsToUser}
        selectionAnimation={isPlantSelected && selectionAnimation}
        transform={isPlantSelected ? "scale(1.1);" : ""}
      >
        <span>{name}</span>
        <img alt={name} src={image} />
      </PlantCard>
    </PlantContainer>
  );
}

interface PlantCardProps {
  selectionAnimation?: any;
  opacity?: string;
  isPlantSelected?: boolean;
  transform?: string;
  belongsToUser?: boolean;
}

const PlantContainer = styled.div`
  height: 25%;
  margin: 0 auto 8% auto;
  position: relative;
  width: 70%;
`;

export const PlantCard = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.primary_brown};
  border: none;
  border-radius: 5px;
  box-shadow: inset 0px 0px 2px black;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  height: 100%;
  opacity: ${(p: PlantCardProps) => p.opacity};
  overflow: hidden;
  padding: 3px 3px 5px 3px;
  width: 100%;
  transition: transform 0.2s ease;
  transform: ${(p: PlantCardProps) => p.transform};
  @media (${LARGE_RESPONSIVE_BREAK}) {
    max-width: 55px;
  }
  > img {
    border-radius: 5px;
    height: 80%;
    width: 85%;
  }
  > span {
    font-size: 11px;
    font-weight: bold;
    @media (${LARGE_RESPONSIVE_BREAK}) {
      font-size: 10px;
    }
    @media (${MEDIUM_RESPONSIVE_BREAK}) {
      font-size: 8px;
    }
  }
  @media (${MEDIUM_RESPONSIVE_BREAK}) {
    height: 45px;
    margin-bottom: 0;
    width: 45px;
  }
  &:hover {
    ${({ theme }) => `
    box-shadow: 4px 4px 4px ${theme.secondary_brown}, inset 0px 0px 5px black;
    transform: scale(1.05);
    `};
  }
  &:active {
    box-shadow: inset 0px 0px 20px black;
  }
  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -85%;
    margin-left: -25%;
    height: 165%;
    width: 50%;
    z-index: -2;
    background: ${(p: PlantCardProps) =>
      p.opacity === "1" && p.belongsToUser
        ? "linear-gradient(90deg, #5f0a87, #e3cdac, #a4508b)"
        : "none"};
    background-size: 300% 300%;
    ${(p: PlantCardProps) => p.selectionAnimation};
  }
  &::after {
    content: "";
    border-radius: 5px;
    position: absolute;
    top: 3.5px;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%);
    height: calc(100% - 7px);
    width: ${(p: PlantCardProps) =>
      p.opacity === "1" ? "calc(100% - 7px);" : "auto"};
    background: ${({ theme }) => theme.primary_brown};
    z-index: -1;
    background-size: 300% 300%;
  }
`;
