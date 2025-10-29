import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { loadObject, saveObject } from "../lib/storage";

export type QuestGoal = {
  id: string;
  exercise: string;
  target: number;
  unit?: string;
  current: number;
};

export type Quest = {
  id: string;
  title: string;
  goals: QuestGoal[];
};

type QuestsState = {
  quests: Quest[];
  activeQuestId: string | null;
  activeQuest: Quest | null;
  addQuest: (q: Quest) => void;
  updateQuest: (q: Quest) => void;
  deleteQuest: (id: string) => void;
  setActiveQuestId: (id: string | null) => void;
  createQuest: (title?: string) => Quest;
};

const STORAGE_KEY = "quests_state_v1";

const QuestsContext = createContext<QuestsState | undefined>(undefined);

type Persisted = { quests: Quest[]; activeQuestId: string | null };

function generateId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

export const QuestsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const persisted = await loadObject<Persisted>(STORAGE_KEY);
      if (persisted) {
        setQuests(persisted.quests || []);
        setActiveQuestId(persisted.activeQuestId || null);
      } else {
        // seed with a default quest for first run
        const seed: Quest = {
          id: generateId("quest"),
          title: "DAILY QUEST - TRAIN TO BECOME\nA FORMIDABLE COMBATANT",
          goals: [
            {
              id: generateId("g"),
              exercise: "PUSH-UPS",
              current: 0,
              target: 100,
            },
            {
              id: generateId("g"),
              exercise: "SIT-UPS",
              current: 0,
              target: 100,
            },
            {
              id: generateId("g"),
              exercise: "SQUATS",
              current: 0,
              target: 100,
            },
            {
              id: generateId("g"),
              exercise: "RUN",
              current: 0,
              target: 10,
              unit: "KM",
            },
          ],
        };
        setQuests([seed]);
        setActiveQuestId(seed.id);
      }
    })();
  }, []);

  const persist = useCallback(
    async (nextQuests: Quest[], nextActive: string | null) => {
      await saveObject<Persisted>(STORAGE_KEY, {
        quests: nextQuests,
        activeQuestId: nextActive,
      });
    },
    []
  );

  const addQuest = useCallback(
    (q: Quest) => {
      setQuests((prev) => {
        const next = [...prev, q];
        void persist(next, activeQuestId);
        return next;
      });
    },
    [activeQuestId, persist]
  );

  const updateQuest = useCallback(
    (q: Quest) => {
      setQuests((prev) => {
        const next = prev.map((it) => (it.id === q.id ? q : it));
        void persist(next, activeQuestId);
        return next;
      });
    },
    [activeQuestId, persist]
  );

  const deleteQuest = useCallback(
    (id: string) => {
      setQuests((prev) => {
        const next = prev.filter((q) => q.id !== id);
        const nextActive =
          activeQuestId === id ? (next[0]?.id ?? null) : activeQuestId;
        setActiveQuestId(nextActive);
        void persist(next, nextActive);
        return next;
      });
    },
    [activeQuestId, persist]
  );

  const setActive = useCallback(
    (id: string | null) => {
      setActiveQuestId(() => {
        void persist(quests, id);
        return id;
      });
    },
    [persist, quests]
  );

  const createQuest = useCallback(
    (title?: string): Quest => {
      const q: Quest = {
        id: generateId("quest"),
        title: title || "NEW QUEST",
        goals: [
          { id: generateId("g"), exercise: "PUSH-UPS", current: 0, target: 10 },
        ],
      };
      addQuest(q);
      return q;
    },
    [addQuest]
  );

  const activeQuest = useMemo(
    () => quests.find((q) => q.id === activeQuestId) || null,
    [quests, activeQuestId]
  );

  const value = useMemo<QuestsState>(
    () => ({
      quests,
      activeQuestId,
      activeQuest,
      addQuest,
      updateQuest,
      deleteQuest,
      setActiveQuestId: setActive,
      createQuest,
    }),
    [
      quests,
      activeQuestId,
      activeQuest,
      addQuest,
      updateQuest,
      deleteQuest,
      setActive,
      createQuest,
    ]
  );

  return (
    <QuestsContext.Provider value={value}>{children}</QuestsContext.Provider>
  );
};

export function useQuests(): QuestsState {
  const ctx = useContext(QuestsContext);
  if (!ctx) throw new Error("useQuests must be used within QuestsProvider");
  return ctx;
}
