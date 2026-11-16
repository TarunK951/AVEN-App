import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Page, Field, Choice, Notice, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useCustomer } from "../../store/customer";
import { products } from "../../data/catalog";
import { ui } from "../../ui/theme";
export default function Reviews() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    p = products.find((p) => p.id === Number(id)),
    { data, update } = useCustomer(),
    [rating, setRating] = useState(5),
    [text, setText] = useState(""),
    [feedback, setFeedback] = useState("");
  const reviews = data.reviews.filter((r) => r.productId === p?.id);
  return (
    <Page
      title="A little perspective."
      intro={p?.name ?? "Product unavailable"}
      testID="reviews-screen"
    >
      <Notice>
        Local reviews only. These are not verified customer reviews and are
        never published or shared.
      </Notice>
      {reviews.length > 0 ? (
        <Text style={ui.h2}>
          {(reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(
            1,
          )}{" "}
          / 5 · {reviews.length} local reviews
        </Text>
      ) : (
        <Text style={ui.body}>
          Be the first to leave a review on this device.
        </Text>
      )}
      {reviews.map((r) => (
        <View key={r.id} style={a.card}>
          <Text style={a.label}>
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)} · {r.name}
          </Text>
          <Text style={ui.body}>{r.text}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              update((old) => ({
                ...old,
                reviews: old.reviews.filter((x) => x.id !== r.id),
              }))
            }
          >
            <Text style={a.link}>Remove local review</Text>
          </Pressable>
        </View>
      ))}
      {p && (
        <>
          <Text style={ui.h2}>Share your first impression.</Text>
          <View style={a.wrap}>
            {[1, 2, 3, 4, 5].map((n) => (
              <Choice
                key={n}
                label={`${n} ★`}
                selected={rating === n}
                onPress={() => setRating(n)}
              />
            ))}
          </View>
          <Field
            label="Your review"
            value={text}
            multiline
            onChange={setText}
          />
          <Button
            onPress={() => {
              if (text.trim().length < 10) {
                setFeedback("Please write at least 10 characters.");
                return;
              }
              update((old) => ({
                ...old,
                reviews: [
                  {
                    id: `REV-${Date.now()}`,
                    productId: p.id,
                    rating,
                    text: text.trim(),
                    name: old.profile.firstName || "Guest",
                  },
                  ...old.reviews,
                ],
              }));
              setText("");
              setFeedback("Review saved locally. It has not been published.");
            }}
          >
            Save local review
          </Button>
          {!!feedback && (
            <Text accessibilityRole="alert" style={a.success}>
              {feedback}
            </Text>
          )}
        </>
      )}
    </Page>
  );
}
