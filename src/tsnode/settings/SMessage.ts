/**
 * @author David G.
 */
module SMessage {
    //STopic defines the STopic of a message. BusDevices subscribe to Topics
    export class Topic {

        static SETTINGS_MSG = new Topic("settings message");

        name:string;

        //instantiates a new STopic with ID and name
        constructor(pName:string) {
            this.name = pName;
        }

        public getName(): string {
            return this.name
        }

        public equals(topic: Topic): boolean {
            return this.name === topic.name;
        }
    }

    //super class for all SMessage Types
    export class Message {
        topic:Topic;

        constructor(pTopic:Topic) {
            this.topic = pTopic;
        }

        public getTopic():Topic {
            return this.topic;
        }
    }

    export class Value {
        value: number;
        identifier: string;

        constructor(pValue:number, pID: string) {
            this.value = pValue;
            this.identifier = pID;
        }

        public numericalValue(): number {
            return this.value;
        }

        public getIdentifier(): string{
            return this.identifier;
        }

    }
}
