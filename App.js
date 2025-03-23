import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function App() {
  const [time, setTime] = useState(60);
  const [hasStarted, setHasStarted] = useState(false);

  const teaData = {
    Green: { color: '#B7D5BA', brewTime: 20 },
    Black: { color: '#A06612', brewTime: 40 },
    Herbal: { color: '#EFC6D1', brewTime: 15 },
    Genmai: { color: '#BB9470', brewTime: 30 },
  };
  const [teaType, setTeaType] = useState("Green");
  const [teaColor, setTeaColor] = useState(teaData['Green'].color);
  const [brewTime, setBrewTime] = useState(teaData['Green'].brewTime);

  const handleTeaChange = (tea) => {
    setTeaType(tea);
    setTeaColor(teaData[tea].color);
    setBrewTime(teaData[tea].brewTime);
  };

  useEffect(() => {
    let timer;    
    if (hasStarted && time > 0) {
      timer = setInterval(() => {
        setTime(prevTime => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      setHasStarted(false);
      Alert.alert(
        "Teapot Hint",
        "Bravo! Enjoy your cup of tea!",
        [
          { text: "OK", onPress: () => 
            {
              console.log("OK Pressed");
              setHasStarted(false);
              //TODO: set stage to next step
            } 
          }
        ]
      );
    }
    return () => clearInterval(timer);
  }, [hasStarted, time]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => {
    setTime(brewTime);
    setHasStarted(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: teaColor }]}>
      {!hasStarted ? (
        <>
          <Text style={styles.label}>Start brewing a cup of tea</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={teaType}
              onValueChange={handleTeaChange}
              style={styles.picker}
            >
              {Object.keys(teaData).map((tea) => (
                <Picker.Item key={tea} label={tea} value={tea} />
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

      <Button title={hasStarted ? "Back" : "Start"} 
        onPress={
          hasStarted 
          ? () => {setHasStarted(false);}
          : startTimer
        } />
      <Button title="Start a new cup of tea!" onPress={() => {
        setHasStarted(false);
        setTime(brewTime); 
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
    fontSize: 25,
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

