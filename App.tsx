import React, {useEffect, useState} from 'react';
import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import dynamicLinks from '@react-native-firebase/dynamic-links';

// Link we can add anything with the slash after the "invertase.io/YOUR_CONTENT" the link will be
const LINK = 'https://invertase.io';
// Domain prefix from the firebase console that you have created
const DOMAIN_PREFIX = 'https://deeplinkdemotest1.page.link';

const App = () => {
  const [generatedLink, setGeneratedLink] = useState<string>('');

  const handleRedirection = (linkUrl: string) => {
    if (linkUrl && linkUrl === `${LINK}/testingOffer`) {
      Alert.alert(
        'SUCCESSFULLY MATCHED LINK HERE YOU CAN REDIRECT TO WHEREVER YOU WANT',
      );
    } else {
      Alert.alert('FAILED TO MATCH THE LINK');
    }
  };

  // Foreground listener for The dynamic link
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(link => {
      handleRedirection(link.url);
    });
    return () => unsubscribe();
  }, []);

  //Background
  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        link && handleRedirection(link.url);
      });
  }, []);

  //In case we want to generate the dynamic link
  const buildLink = async () => {
    const link = await dynamicLinks().buildLink({
      // link: `${LINK}/YOUR_CONTENT_GOES_HERE`, And the same link will be listened in the handleRedirection
      link: `${LINK}/testingOffer`,
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: DOMAIN_PREFIX,
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
    });

    setGeneratedLink(link);
  };

  return (
    <View style={styles.container}>
      <Button title="generate the Dynamic link" onPress={buildLink} />
      {generatedLink && (
        <Text style={styles.longPressSuggestionText}>
          Long press the Below link to Copy
        </Text>
      )}
      <Text selectable={true} selectionColor="orange">
        {generatedLink}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  longPressSuggestionText: {
    marginBottom: 20,
    fontSize: 15,
    color: 'gray',
  },
});

export default App;
