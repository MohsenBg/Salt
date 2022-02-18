import Avatar from "avataaars";
import axios from "axios";
import React, { FunctionComponent, useEffect, useState } from "react";
import { url } from "../../../../../url";
import Rolling from "../../../../other/loading/Rolling";
import Image from "next/image";
interface Props {
  userName: string;
}

const Avatars: FunctionComponent<Props> = ({ userName }) => {
  const [AvatarUser, setAvatarUser] = useState({
    userName: "",
    topType: "",
    hairColor: "",
    accessoriesType: "",
    eyeType: "",
    eyebrowType: "",
    clotheType: "",
    clotheColor: "",
    facialHairType: "",
    facialHairColor: "",
    mouthType: "",
    skinColor: "",
  });
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getAvatar = async () => {
      setLoading(true);
      await axios
        .get(`${url}/avatar/${userName}`)
        .then((result) => {
          setAvatarUser(result.data);
        })
        .catch((error) => {
          console.log(error);
        });
      setLoading(false);
    };
    getAvatar();
  }, [userName]);

  return (
    <div>
      <>
        {loading ? (
          <div>
            <Rolling width="50px" />
          </div>
        ) : (
          <>
            {AvatarUser ? (
              <div>
                <Avatar
                  avatarStyle="Circle"
                  topType={AvatarUser.topType}
                  hairColor={AvatarUser.hairColor}
                  accessoriesType={AvatarUser.accessoriesType}
                  eyeType={AvatarUser.eyeType}
                  eyebrowType={AvatarUser.eyebrowType}
                  clotheType={AvatarUser.clotheType}
                  clotheColor={AvatarUser.clotheColor}
                  facialHairType={AvatarUser.facialHairType}
                  facialHairColor={AvatarUser.facialHairColor}
                  mouthType={AvatarUser.mouthType}
                  skinColor={AvatarUser.skinColor}
                  style={{ width: "54px", height: "54px" }}
                />
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  borderRadius: "50%",
                  overflow: "hidden",
                }}
              >
                <Image src="/assets/noAvatar.jpg" width="54px" height="54px" />
              </div>
            )}
          </>
        )}
      </>
    </div>
  );
};

export default Avatars;
