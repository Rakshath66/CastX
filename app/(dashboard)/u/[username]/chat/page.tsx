import { getSelf } from "@/lib/auth-service";
import { getStreamByUserId } from "@/lib/stream-service";
import { ToggleCard } from "./_components/toggle-card";

const ChatPage = async () => {
    const self = await getSelf(); //cannot add suspense for this page - beacuse its in root page
    const stream = await getStreamByUserId(self.id);

    if(!stream) {
        throw new Error("Stream not found");
    }

    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-2xl font-bold">
                    Chat Settings
                </h1>
            </div>
            <div className="space-y-4">
                <ToggleCard 
                  field="isChatEnabled" //key(reserved keyword) cannot be accessible, so field.
                  label="Enable Chat"
                  value={stream.isChatEnabled}
                />
                <ToggleCard 
                  field="isChatDelayed"
                  label="Delay Chat"
                  value={stream.isChatDelayed}
                />
                <ToggleCard 
                  field="isChatFollowersOnly"
                  label="Must be following to chat"
                  value={stream.isChatFollowersOnly}
                />
            </div>
        </div>
    )
}

export default ChatPage;