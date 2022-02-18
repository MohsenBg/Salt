import Avatar from "avataaars";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { STORE_STATE } from "../../../../../store";
import { url } from "../../../../../url";
import styles from "./AvatarMaker.module.scss";

const configs = {
  topType: [
    "NoHair",
    "Eyepatch",
    "Hat",
    "Hijab",
    "Turban",
    "WinterHat1",
    "WinterHat2",
    "WinterHat3",
    "WinterHat4",
    "LongHairBigHair",
    "LongHairBob",
    "LongHairBun",
    "LongHairCurly",
    "LongHairCurvy",
    "LongHairDreads",
    "LongHairFrida",
    "LongHairFro",
    "LongHairFroBand",
    "LongHairNotTooLong",
    "LongHairShavedSides",
    "LongHairMiaWallace",
    "LongHairStraight",
    "LongHairStraight2",
    "LongHairStraightStrand",
    "ShortHairDreads01",
    "ShortHairDreads02",
  ],
  accessoriesType: [
    "Blank",
    "Kurt",
    "Prescription01",
    "Prescription02",
    "Round",
    "Sunglasses",
    "Wayfarers",
  ],
  hatColor: [
    "Black",
    "Blue01",
    "Blue02",
    "Blue03",
    "Gray01",
    "Gray02",
    "Heather",
    "PastelBlue",
    "PastelGreen",
    "PastelOrange",
    "PastelRed",
    "PastelYellow",
    "Pink",
    "Red",
    "White",
  ],
  hairColor: [
    "Auburn",
    "Black",
    "Blonde",
    "BlondeGolden",
    "Brown",
    "BrownDark",
    "PastelPink",
    "Platinum",
    "Red",
    "SilverGray",
  ],
  facialHairType: [
    "Blank",
    "BeardMedium",
    "BeardLight",
    "BeardMajestic",
    "MoustacheFancy",
    "MoustacheMagnum",
  ],
  facialHairColor: [
    "Auburn",
    "Black",
    "Blonde",
    "BlondeGolden",
    "Brown",
    "BrownDark",
    "Platinum",
    "Red",
  ],
  clotheType: [
    "BlazerShirt",
    "BlazerSweater",
    "CollarSweater",
    "GraphicShirt",
    "Hoodie",
    "Overall",
    "ShirtCrewNeck",
    "ShirtScoopNeck",
    "ShirtVNeck",
  ],
  clotheColor: [
    "Black",
    "Blue01",
    "Blue02",
    "Blue03",
    "Gray01",
    "Gray02",
    "Heather",
    "PastelBlue",
    "PastelGreen",
    "PastelOrange",
    "PastelRed",
    "PastelYellow",
    "Pink",
    "Red",
    "White",
  ],

  eyeType: [
    "Close",
    "Cry",
    "Default",
    "Dizzy",
    "EyeRoll",
    "Happy",
    "Hearts",
    "Side",
    "Squint",
    "Surprised",
    "Wink",
    "WinkWacky",
  ],
  eyebrowType: [
    "Angry",
    "AngryNatural",
    "Default",
    "DefaultNatural",
    "FlatNatural",
    "RaisedExcited",
    "RaisedExcitedNatural",
    "SadConcerned",
    "SadConcernedNatural",
    "UnibrowNatural",
    "UpDown",
    "UpDownNatural",
  ],
  mouthType: [
    "Concerned",
    "Default",
    "Disbelief",
    "Eating",
    "Grimace",
    "Sad",
    "ScreamOpen",
    "Serious",
    "Smile",
    "Tongue",
    "Twinkle",
    "Vomit",
  ],
  skinColor: [
    "Tanned",
    "Yellow",
    "Pale",
    "Light",
    "Brown",
    "DarkBrown",
    "Black",
  ],
};

const tabs = [
  {
    id: "SkinColor",
    minTabs: ["skinColor"],
  },
  {
    id: "Hair",
    minTabs: ["topType", "hairColor"],
  },
  {
    id: "Eye",
    minTabs: ["eyeType", "eyebrowType", "accessoriesType"],
  },
  {
    id: "FacialHair",
    minTabs: ["facialHairType", "facialHairColor"],
  },
  {
    id: "MouthType",
    minTabs: ["mouthType"],
  },
  {
    id: "Clothe",
    minTabs: ["clotheType", "clotheColor"],
  },
];
const AvatarMaker = ({
  currentUserAvatar,
  setAvatarStatus,
  setAvatar,
}: any) => {
  const [selectedTab, setSelectedTab] = useState("SkinColor");
  const [MinTab, setMinTab] = useState("skinColor");
  const [RenderAvatar, setRenderAvatar] = useState({
    id: "skinColor",
    data: [...configs.skinColor],
  });
  const [userAvatar, setUserAvatar] = useState({
    topType: "NoHair",
    hairColor: "Blank",
    accessoriesType: "Black",
    eyeType: "Close",
    eyebrowType: "Angry",
    clotheType: "BlazerShirt",
    clotheColor: "Black",
    facialHairType: "Black",
    facialHairColor: "Auburn",
    mouthType: "Default",
    skinColor: "Tanned",
  });
  useEffect(() => {
    switch (MinTab) {
      case "topType":
        setRenderAvatar({ id: "topType", data: [...configs.topType] });
        break;
      case "hairColor":
        setRenderAvatar({ id: "hairColor", data: [...configs.hairColor] });
        break;
      case "accessoriesType":
        setRenderAvatar({
          id: "accessoriesType",
          data: [...configs.accessoriesType],
        });
        break;
      case "eyeType":
        setRenderAvatar({ id: "eyeType", data: [...configs.eyeType] });
        break;
      case "eyebrowType":
        setRenderAvatar({ id: "eyebrowType", data: [...configs.eyebrowType] });
        break;
      case "clotheType":
        setRenderAvatar({ id: "clotheType", data: [...configs.clotheType] });
        break;
      case "clotheColor":
        setRenderAvatar({ id: "clotheColor", data: [...configs.clotheColor] });
        break;
      case "facialHairType":
        setRenderAvatar({
          id: "facialHairType",
          data: [...configs.facialHairType],
        });
        break;
      case "facialHairColor":
        setRenderAvatar({
          id: "facialHairColor",
          data: [...configs.facialHairColor],
        });
        break;
      case "mouthType":
        setRenderAvatar({ id: "mouthType", data: [...configs.mouthType] });
        break;
      case "skinColor":
        setRenderAvatar({ id: "skinColor", data: [...configs.skinColor] });
        break;
      default:
        break;
    }
  }, [MinTab]);

  const username = useSelector((state: STORE_STATE) => state.userInfo.username);

  useEffect(() => {
    if (currentUserAvatar) setUserAvatar(currentUserAvatar);
  }, [currentUserAvatar]);

  const handelClick = (id: string, data: string) => {
    switch (id) {
      case "topType":
        setUserAvatar({ ...userAvatar, topType: data });
        break;
      case "hairColor":
        setUserAvatar({ ...userAvatar, hairColor: data });
        break;
      case "accessoriesType":
        setUserAvatar({ ...userAvatar, accessoriesType: data });
        break;
      case "eyeType":
        setUserAvatar({ ...userAvatar, eyeType: data });
        break;
      case "eyebrowType":
        setUserAvatar({ ...userAvatar, eyebrowType: data });
        break;
      case "clotheType":
        setUserAvatar({ ...userAvatar, clotheType: data });
        break;
      case "clotheColor":
        setUserAvatar({ ...userAvatar, clotheColor: data });
        break;
      case "facialHairType":
        setUserAvatar({ ...userAvatar, facialHairType: data });
        break;
      case "facialHairColor":
        setUserAvatar({ ...userAvatar, facialHairColor: data });
        break;
      case "mouthType":
        setUserAvatar({ ...userAvatar, mouthType: data });
        break;
      case "skinColor":
        setUserAvatar({ ...userAvatar, skinColor: data });
        break;
      default:
        break;
    }
  };

  const skip = () => {
    setAvatarStatus(false);
  };

  const save = async () => {
    let PostUrl = currentUserAvatar ? `${url}/avatar/edit` : `${url}/avatar`;
    await axios
      .post(PostUrl, { ...userAvatar, userName: username })
      .then((result) => {
        setAvatar(result.data);
        setAvatarStatus(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.head}>
        <div className={styles.tabs}>
          {tabs.map((tab) => {
            return (
              <div
                key={tab.id}
                className={styles.tab}
                onClick={() => {
                  setSelectedTab(tab.id);
                  setMinTab(tab.minTabs[0]);
                }}
                style={
                  tab.id === selectedTab
                    ? {
                        backgroundColor: "aqua",
                        color: "white",
                        fontWeight: "bold",
                      }
                    : {}
                }
              >
                {tab.id}
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.userAvatar}>
        <Avatar
          avatarStyle="Circle"
          topType={userAvatar.topType}
          hairColor={userAvatar.hairColor}
          accessoriesType={userAvatar.accessoriesType}
          eyeType={userAvatar.eyeType}
          eyebrowType={userAvatar.eyebrowType}
          clotheType={userAvatar.clotheType}
          clotheColor={userAvatar.clotheColor}
          facialHairType={userAvatar.facialHairType}
          facialHairColor={userAvatar.facialHairColor}
          mouthType={userAvatar.mouthType}
          skinColor={userAvatar.skinColor}
          style={{ width: "220px", height: "100%" }}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.box}>
          {tabs.map((tab) => {
            if (tab.id === selectedTab) {
              return (
                <div key={tab.id} className={styles.minTabs}>
                  {tab.minTabs.map((minTab) => {
                    return (
                      <div
                        className={styles.minTab}
                        style={
                          minTab === MinTab
                            ? {
                                backgroundColor: "red",
                                color: "white",
                                fontWeight: "bold",
                              }
                            : {}
                        }
                        key={minTab}
                        onClick={() => setMinTab(minTab)}
                      >
                        <div>{minTab}</div>
                      </div>
                    );
                  })}
                </div>
              );
            }
          })}
          <div className={styles.avatars}>
            {RenderAvatar.data.map((Render) => {
              return (
                <div
                  style={
                    //@ts-ignore
                    userAvatar[RenderAvatar.id] === Render
                      ? { backgroundColor: "yellow" }
                      : {}
                  }
                  key={Render}
                  className={styles.avatar}
                  onClick={() => handelClick(RenderAvatar.id, Render)}
                >
                  <Avatar
                    key={Render}
                    avatarStyle=""
                    style={{ width: "100px", height: "100px" }}
                    topType={
                      RenderAvatar.id === "topType"
                        ? Render
                        : RenderAvatar.id === "hairColor"
                        ? configs.topType[12]
                        : configs.topType[0]
                    }
                    hairColor={
                      RenderAvatar.id === "hairColor"
                        ? Render
                        : configs.hairColor[0]
                    }
                    accessoriesType={
                      RenderAvatar.id === "accessoriesType"
                        ? Render
                        : configs.accessoriesType[0]
                    }
                    eyeType={
                      RenderAvatar.id === "eyeType"
                        ? Render
                        : configs.eyeType[0]
                    }
                    eyebrowType={
                      RenderAvatar.id === "eyebrowType"
                        ? Render
                        : configs.eyebrowType[0]
                    }
                    clotheType={
                      RenderAvatar.id === "clotheType"
                        ? Render
                        : RenderAvatar.id === "clotheColor"
                        ? configs.clotheType[3]
                        : configs.clotheType[0]
                    }
                    clotheColor={
                      RenderAvatar.id === "clotheColor"
                        ? Render
                        : configs.clotheColor[0]
                    }
                    facialHairType={
                      RenderAvatar.id === "facialHairType"
                        ? Render
                        : RenderAvatar.id === "facialHairColor"
                        ? configs.facialHairType[1]
                        : configs.facialHairType[0]
                    }
                    facialHairColor={
                      RenderAvatar.id === "facialHairColor"
                        ? Render
                        : configs.facialHairColor[2]
                    }
                    mouthType={
                      RenderAvatar.id === "mouthType"
                        ? Render
                        : configs.mouthType[10]
                    }
                    skinColor={
                      RenderAvatar.id === "skinColor"
                        ? Render
                        : configs.skinColor[2]
                    }
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className={styles.btnContainer}>
        <div className={styles.btn}>
          <span onClick={skip}>Skip</span>
        </div>
        <div className={styles.btn}>
          <span onClick={save}>Save</span>
        </div>
      </div>
    </div>
  );
};

export default AvatarMaker;
