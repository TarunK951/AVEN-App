import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Page, Choice, Field, Notice, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useCustomer } from "../../store/customer";
import { ui } from "../../ui/theme";
const faqs = [
  [
    "Where is my order?",
    "Open My Orders and select an order to view its details and current status.",
  ],
  [
    "How do returns work?",
    "Open your order details and choose Request return or Request exchange. Add a reason and save your request details.",
  ],
  [
    "Can I change my order?",
    "Open order details to find your options. You can also use Buy again to build a new bag.",
  ],
  [
    "How do I care for my pieces?",
    "Each product page has fabric and care notes. Follow the care label on your garment for the best results.",
  ],
];
export default function Support() {
  const { data, update } = useCustomer(),
    [open, setOpen] = useState(""),
    [topic, setTopic] = useState("Order help"),
    [message, setMessage] = useState(""),
    [feedback, setFeedback] = useState("");
  return (
    <Page
      title="A little help, right here."
      intro="Let’s make your everyday a little easier."
      testID="support-screen"
    >
      <Text style={ui.eyebrow}>FREQUENTLY ASKED</Text>
      {faqs.map(([q, answer]) => (
        <View key={q}>
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ expanded: open === q }}
            onPress={() => setOpen(open === q ? "" : q)}
            style={a.row}
          >
            <Text style={[a.label, { flex: 1 }]}>{q}</Text>
            <Text style={a.label}>{open === q ? "−" : "+"}</Text>
          </Pressable>
          {open === q && (
            <Text style={[ui.body, { paddingVertical: 16 }]}>{answer}</Text>
          )}
        </View>
      ))}
      <Text style={[ui.h2, { marginTop: 8 }]}>How can we help?</Text>

      <View style={a.wrap}>
        {[
          "Order help",
          "Returns & exchanges",
          "Product question",
          "Something else",
        ].map((t) => (
          <Choice
            key={t}
            label={t}
            selected={topic === t}
            onPress={() => setTopic(t)}
          />
        ))}
      </View>
      <Field
        label="Your message"
        value={message}
        multiline
        onChange={setMessage}
      />
      <Button
        onPress={() => {
          if (message.trim().length < 10) {
            setFeedback("Please write at least 10 characters.");
            return;
          }
          update((old) => ({
            ...old,
            tickets: [
              { id: `NOTE-${Date.now()}`, topic, message: message.trim() },
              ...old.tickets,
            ].slice(0, 50),
          }));
          setMessage("");
          setFeedback("Message saved. ");
        }}
      >
        Save message
      </Button>
      {!!feedback && (
        <Text accessibilityRole="alert" style={a.success}>
          {feedback}
        </Text>
      )}
      {data.tickets.length > 0 && <Text style={ui.eyebrow}>YOUR MESSAGES</Text>}
      {data.tickets.map((t) => (
        <View key={t.id} style={a.card}>
          <Text style={a.label}>{t.topic}</Text>
          <Text style={ui.body}>{t.message}</Text>
          <Pressable
            accessibilityRole="button"
            onPress={() =>
              update((old) => ({
                ...old,
                tickets: old.tickets.filter((x) => x.id !== t.id),
              }))
            }
          >
            <Text style={a.link}>Remove message</Text>
          </Pressable>
        </View>
      ))}
    </Page>
  );
}
