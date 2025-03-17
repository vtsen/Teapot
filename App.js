import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [time, setTime] = useState(minutes * 60 + seconds);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    let timer;    
    if (hasStarted && time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setHasStarted(false);
      alert("Time's up! Next cup of tea! :)");
    }
    return () => clearInterval(timer);
  }, [hasStarted, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTime(minutes * 60 + seconds);
    setHasStarted(true);
  };

  return (
    <View style={styles.container}>
      {!hasStarted ? (
        <>
          <Text style={styles.label}>Set Timer:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={minutes}
              style={styles.picker}
              onValueChange={(itemValue) => setMinutes(itemValue)}
            >
              {Array.from({ length: 6 }, (_, i) => (
                <Picker.Item key={i} label={`${i} min`} value={i} />
              ))}
            </Picker>
            <Picker
              selectedValue={seconds}
              style={styles.picker}
              onValueChange={(itemValue) => setSeconds(itemValue)}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <Picker.Item key={i*5} label={`${i*5} sec`} value={i*5} />
              ))}
            </Picker>
          </View>
        </>
      ) : (
        <>
        <Text style={styles.hint}>
          Take the time, slow down, and prepare for a cup of tea.
          </Text>
        <Text style={styles.timer}>{formatTime(time)}</Text>
        </>
      )}

      <Button title={
          hasStarted ? "Back" : "Start"
        } 
        onPress={
          hasStarted 
          ? () => {setHasStarted(false);}
          : startTimer
        } />
      <Button title="Reset" onPress={() => {
        setHasStarted(false);
        setTime(minutes * 60 + seconds); 
        }
        } />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
  },
  label: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000',
  },
  hint: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  picker: {
    height: 200,
    width: 150,
    color: '#000',
  },
  timer: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
});

