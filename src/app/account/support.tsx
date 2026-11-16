import { useState } from "react";
import { Text, View, Pressable } from "react-native";
import { Page, Choice, Field, Notice, a } from "../../ui/account";
import { Button } from "../../ui/components";
import { useCustomer } from "../../store/customer";
import { ui } from "../../ui/theme";
const faqs = [
  [
    "Where is my order?",
    "Open My Orders for a local tracking preview. No real shipment or carrier tracking is connected.",
  ],
  [
    "How do returns work?",
    "Open a delivered sample order and choose Request return or Request exchange. Requests stay on this device; no shipping label or refund is created.",
  ],
  [
    "Can I change my order?",
    "Processing demo orders can be cancelled from order details. You can then rebuild your bag.",
  ],
  [
    "How do I care for my pieces?",
    "Follow the garment label. Product-page descriptions and size guidance are preview information.",
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
      <Text style={[ui.h2, { marginTop: 8 }]}>Keep a note for us.</Text>
      <Notice>
        Support draft only · Nothing is sent. Avoid entering private or payment
        information.
      </Notice>
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
          setFeedback("Draft saved on this device. No message was sent.");
        }}
      >
        Save support draft
      </Button>
      {!!feedback && (
        <Text accessibilityRole="alert" style={a.success}>
          {feedback}
        </Text>
      )}
      {data.tickets.length > 0 && (
        <Text style={ui.eyebrow}>YOUR SAVED DRAFTS</Text>
      )}
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
            <Text style={a.link}>Remove draft</Text>
          </Pressable>
        </View>
      ))}
    </Page>
  );
}
