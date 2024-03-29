import { toast } from "sonner";
import { useEffect, useState } from "react";
import { JwtPayload, jwtDecode } from "jwt-decode";

import { createViewerToken } from "@/actions/token";

//create token for each viewers and return
//who is watching the stream, what is their name, identity, token, give permission, kick user, etc features.
export const useViewerToken = (hostIdentity: string) => {
    const [token, setToken] = useState("");
    const [name, setName] = useState("");
    const [identity, setIdentity] = useState("");

    useEffect(() => {
       const createToken = async () => {
        try {
            //get viewers token and decode the details from it
            const viewerToken = await createViewerToken(hostIdentity);
            setToken(viewerToken);

            const decodeToken = jwtDecode(viewerToken) as JwtPayload & { name?: string }
            const name = decodeToken?.name;
            const identity = decodeToken?.jti;

            if(identity) {
                setIdentity(identity);
            }

            if(name) {
                setName(name);
            }

        } catch {
            toast.error("Something went wrong");
        }

        }
        createToken();
    }, [hostIdentity]);

    return {
        token,
        name,
        identity,
    }
}