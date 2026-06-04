import React, {useEffect, useState} from 'react';
import {
  useStreamVideoClient,
  useCallStateHooks,
  CallingState,
  StreamCall,
  CallContent,
} from '@stream-io/video-react-native-sdk';
import { Button, View } from 'react-native';

export default function VideoUi({callId}) {
    const [call, setCall]= useState();
    const client = useStreamVideoClient();
    useEffect(() => {
        const _call = client?.call("default", callId);
        _call.join({create: true})
        .then(() => setCall(_call))
        .catch(error => console.log(error))
    }, [client, callId])

    useEffect(() => {
        return () => {
            if (call?.state.callingState != CallingState.LEFT) {
                call?.leave();
            }
        }
    }, [call]);
    if (!call) {
        return (
          <View style={styles.container}>
            <Text style={styles.text}>Joining call...</Text>
          </View>
        );
      }
    
      return (
        <StreamCall call={call}>
          <View style={styles.container}>
            <CallContent />
          </View>
        </StreamCall>
      );
}