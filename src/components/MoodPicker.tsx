"use client";

interface Mood {
  label: string;
  emoji: string;
  color: string;
}

const MOODS: Mood[] = [
  { label: "Stressed", emoji: "😤", color: "#C8472E" },
  { label: "Heartbroken", emoji: "💔", color: "#7A4566" },
  { label: "Celebrating", emoji: "🎉", color: "#EFA13B" },
  { label: "Lazy Sunday", emoji: "😴", color: "#52704F" },
  { label: "Homesick", emoji: "🏠", color: "#CBD4D9" },
  { label: "Adventurous", emoji: "🧭", color: "#EFA13B" },
];

interface MoodPickerProps {
  selected: string | null;
  onSelect: (mood: string) => void;
}

export function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  return (
    <div>
      <p
        style={{
          fontFamily: "var(--font-bricolage)",
          fontWeight: 600,
          fontSize: "1.05rem",
          color: "#1a1a1a",
          marginBottom: "0.85rem",
        }}
      >
        How are you feeling?
      </p>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "0.6rem",
        }}
        role="group"
        aria-label="Mood selector"
      >
        {MOODS.map((mood) => {
          const isSelected = selected === mood.label;
          const isHomesick = mood.label === "Homesick";

          // For "Homesick" with a light steel color, use dark text
          const textColor = isSelected
            ? isHomesick
              ? "#1a1a1a"
              : "#fff"
            : "#1a1a1a";

          return (
            <button
              key={mood.label}
              onClick={() => onSelect(mood.label)}
              aria-pressed={isSelected}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.4rem",
                padding: "0.5rem 1.1rem",
                borderRadius: 999,
                border: isSelected
                  ? `2px solid ${mood.color}`
                  : "2px solid #CBD4D9",
                background: isSelected ? mood.color : "#F6ECD9",
                color: textColor,
                fontWeight: isSelected ? 700 : 500,
                fontSize: "0.9rem",
                fontFamily: "var(--font-inter)",
                cursor: "pointer",
                transition: "all 0.18s ease",
                boxShadow: isSelected
                  ? `0 4px 14px ${mood.color}55`
                  : "none",
                outline: "none",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = `${mood.color}18`;
                  btn.style.borderColor = mood.color;
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  const btn = e.currentTarget as HTMLButtonElement;
                  btn.style.background = "#F6ECD9";
                  btn.style.borderColor = "#CBD4D9";
                }
              }}
              onFocus={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow = `0 0 0 3px ${mood.color}44`;
              }}
              onBlur={(e) => {
                if (!isSelected) {
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "none";
                }
              }}
            >
              <span style={{ fontSize: "1.1rem", lineHeight: 1 }}>{mood.emoji}</span>
              <span>{mood.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
