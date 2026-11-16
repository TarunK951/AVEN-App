import { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Page, Field, Choice, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useCustomer } from "../../store/customer";
import { products } from "../../data/catalog";
import { C, ui } from "../../ui/theme";
export default function Reviews() {
  const { id } = useLocalSearchParams<{ id: string }>(),
    p = products.find((p) => p.id === Number(id)),
    { data, update } = useCustomer();
  const [rating, setRating] = useState(5),
    [text, setText] = useState(""),
    [feedback, setFeedback] = useState(""),
    [editing, setEditing] = useState(false),
    [sort, setSort] = useState("Newest");
  useEffect(() => {
    setRating(5);
    setText("");
    setFeedback("");
    setEditing(false);
  }, [id]);
  const reviews = data.reviews.filter((r) => r.productId === p?.id),
    own = reviews[0],
    average = reviews.length
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;
  const sorted = [...reviews].sort((a, b) =>
    sort === "Highest"
      ? b.rating - a.rating
      : sort === "Lowest"
        ? a.rating - b.rating
        : 0,
  );
  return (
    <Page
      title="A little perspective."
      intro={p?.name ?? "Product unavailable"}
      testID="reviews-screen"
    >
      {reviews.length ? (
        <>
          <View style={a.card}>
            <Text style={[ui.title, { fontSize: 42 }]}>
              {average.toFixed(1)} <Text style={ui.small}>/ 5</Text>
            </Text>
            <Text style={{ color: C.ink, fontSize: 18, letterSpacing: 3 }}>
              {"★".repeat(Math.round(average))}
              {"☆".repeat(5 - Math.round(average))}
            </Text>
            <Text style={ui.small}>
              {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
            </Text>
            {[5, 4, 3, 2, 1].map((n) => {
              const count = reviews.filter((r) => r.rating === n).length;
              return (
                <View
                  key={n}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <Text style={ui.small}>{n} ★</Text>
                  <View
                    style={{
                      flex: 1,
                      height: 5,
                      backgroundColor: C.line,
                      borderRadius: 3,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        width: `${(count / reviews.length) * 100}%`,
                        height: 5,
                        backgroundColor: C.ink,
                      }}
                    />
                  </View>
                  <Text style={ui.small}>{count}</Text>
                </View>
              );
            })}
          </View>
          <View style={a.wrap}>
            {["Newest", "Highest", "Lowest"].map((x) => (
              <Choice
                key={x}
                label={x}
                selected={sort === x}
                onPress={() => setSort(x)}
              />
            ))}
          </View>
        </>
      ) : (
        <Text style={ui.body}>Be the first to share your perspective.</Text>
      )}
      {sorted.map((r) => (
        <View key={r.id} style={a.card}>
          <Text style={a.label}>
            {"★".repeat(r.rating)}
            {"☆".repeat(5 - r.rating)} · {r.name}
          </Text>
          <Text style={ui.body}>{r.text}</Text>
          {r.id === own?.id && (
            <View style={a.wrap}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit your review"
                onPress={() => {
                  setRating(r.rating);
                  setText(r.text);
                  setEditing(true);
                  setFeedback("");
                }}
              >
                <Text style={a.link}>Edit review</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Remove your review"
                onPress={() => {
                  update((old) => ({
                    ...old,
                    reviews: old.reviews.filter((x) => x.productId !== p?.id),
                  }));
                  setText("");
                  setRating(5);
                  setEditing(false);
                  setFeedback("Your review has been removed.");
                }}
              >
                <Text style={a.link}>Remove review</Text>
              </Pressable>
            </View>
          )}
        </View>
      ))}
      {p && (!own || editing) && (
        <>
          <Text style={ui.h2}>
            {own ? "A fresh perspective." : "How did it feel?"}
          </Text>
          <Text style={ui.body}>
            Tell us about the fit, fabric and everyday details.
          </Text>
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
                    id: own?.id ?? `REV-${Date.now()}`,
                    productId: p.id,
                    rating,
                    text: text.trim(),
                    name: old.profile.firstName || "Guest",
                  },
                  ...old.reviews.filter((r) => r.productId !== p.id),
                ],
              }));
              setEditing(false);
              setText("");
              setFeedback(
                own
                  ? "Your review has been updated."
                  : "Thank you. Your review is saved.",
              );
            }}
          >
            {own ? "Update review" : "Save review"}
          </Button>
          {own && (
            <Pressable
              accessibilityRole="button"
              onPress={() => setEditing(false)}
            >
              <Text style={a.link}>Cancel editing</Text>
            </Pressable>
          )}
        </>
      )}
      {!!feedback && (
        <Text accessibilityRole="alert" style={a.success}>
          {feedback}
        </Text>
      )}
    </Page>
  );
}
