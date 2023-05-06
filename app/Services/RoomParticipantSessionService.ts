import { SessionContract } from "@ioc:Adonis/Addons/Session";
import RoomParticipant from "../Models/RoomParticipant";

export default class RoomParticipantSessionService {
    private session: SessionContract

    constructor(session: SessionContract) {
        this.session = session
    }

    public login(participant: RoomParticipant): void {
        if (!this.current()) {
            this.session.put('username', participant.getName())
            this.session.put('user_id', participant.getId())
        }
    }

    public current(): RoomParticipant | null {
        if (!this.session.has('username') || !this.session.has('user_id')) {
            return null
        }

        const res = new RoomParticipant(this.session.get('username'))

        res.setId(this.session.get('user_id'))

        return res
    }
}