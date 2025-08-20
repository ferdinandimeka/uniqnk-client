import React, { useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type GiftCardProps = {
    coins: string;
    amount: string;
    image?: boolean;
}

const GiftCard: React.FC<GiftCardProps> = ({ coins, amount, image }) => {
    const [hover, setHover] = useState(false);
  return (
    <TouchableOpacity
        onPressIn={() => setHover(true)}
        onPressOut={() => setHover(false)}
        style={{ borderColor: hover ? "#7690FF" : "#F1F4FF", borderRadius: 8 }}
    >
        <View style={{ flexDirection: "column", gap: 4, borderWidth: 1, borderColor: "#F1F4FF", position: "relative", borderRadius: 8, height: 70, width: 70, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
            <View style={{ position: "absolute", top: 0, right: 0 }}>
                <Image 
                    source={require('../../assets/icons/Coin.png')}
                    style={{ width: 20, height: 21 }}
                />
            </View>
            <View style={{ flexDirection: "row", gap: 1, alignItems: "center" }}>
                <Text style={{ color: "#474A55", fontFamily: "Mulish", fontWeight: "700", fontSize: 16, lineHeight: 18, letterSpacing: 0 }}>{coins}</Text>
                {image && <Image 
                    source={require('../../assets/icons/Coins.png')}
                    style={{ width: 15, height: 16 }}
                />}
            </View>
            <Text style={{ color: "#474A55", fontFamily: "Mulish", fontWeight: "400", fontSize: 12, lineHeight: 14, letterSpacing: 0 }}>{amount}</Text>
        </View>
    </TouchableOpacity>
  )
}

export default GiftCard