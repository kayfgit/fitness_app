import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AppState } from "react-native";
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
  updateGoalProgress: (
    questId: string,
    goalId: string,
    newProgress: number
  ) => void;
  isQuestCompletedToday: (questId: string) => boolean;
  uncompleteQuest: (questId: string) => void;
};

const STORAGE_KEY = "quests_state_v1";
const QUEST_COMPLETION_KEY = "quest_completion_v1";

const QuestsContext = createContext<QuestsState | undefined>(undefined);

type Persisted = { quests: Quest[]; activeQuestId: string | null };

function generateId(prefix: string = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function getTodayLocalDateString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export const QuestsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [quests, setQuests] = useState<Quest[]>([]);
  const [activeQuestId, setActiveQuestId] = useState<string | null>(null);
  const [questCompletion, setQuestCompletion] = useState<
    Record<string, string>
  >({});

  const resetCompletedQuests = useCallback(async () => {
    const today = getTodayLocalDateString();
    const completion =
      (await loadObject<Record<string, string>>(QUEST_COMPLETION_KEY)) || {};

    const resetQuestsList = quests.map((quest) => {
      const completedDate = completion[quest.id];
      if (completedDate && completedDate < today) {
        return {
          ...quest,
          goals: quest.goals.map((g) => ({ ...g, current: 0 })),
        };
      }
      return quest;
    });

    setQuests(resetQuestsList);

    const newCompletion = { ...completion };
    let needsUpdate = false;
    for (const questId in newCompletion) {
      if (newCompletion[questId] < today) {
        delete newCompletion[questId];
        needsUpdate = true;
      }
    }

    if (needsUpdate) {
      setQuestCompletion(newCompletion);
      await saveObject(QUEST_COMPLETION_KEY, newCompletion);
    }
  }, [quests]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState: any) => {
      if (nextAppState === "active") {
        resetCompletedQuests();
      }
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [resetCompletedQuests]);

  useEffect(() => {
    (async () => {
      try {
        const persisted = await loadObject<Persisted>(STORAGE_KEY);
        const completion = await loadObject<Record<string, string>>(
          QUEST_COMPLETION_KEY
        );

        if (completion) {
          setQuestCompletion(completion);
        }

        if (persisted) {
          const today = getTodayLocalDateString();
          const resetQuests = persisted.quests.map((quest) => {
            const completedDate = completion?.[quest.id];
            if (completedDate && completedDate < today) {
              return {
                ...quest,
                goals: quest.goals.map((g) => ({ ...g, current: 0 })),
              };
            }
            return quest;
          });

          setQuests(resetQuests);
          setActiveQuestId(persisted.activeQuestId || null);

          if (completion) {
            const newCompletion = { ...completion };
            let needsUpdate = false;
            for (const questId in newCompletion) {
              if (newCompletion[questId] < today) {
                delete newCompletion[questId];
                needsUpdate = true;
              }
            }
            if (needsUpdate) {
              setQuestCompletion(newCompletion);
              await saveObject(QUEST_COMPLETION_KEY, newCompletion);
            }
          }
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
      } catch (e) {
        console.error("Failed to load quests:", e);
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

  const updateGoalProgress = useCallback(
    (questId: string, goalId: string, newProgress: number) => {
      setQuests((prev) => {
        const next = prev.map((quest) => {
          if (quest.id === questId) {
            return {
              ...quest,
              goals: quest.goals.map((goal) =>
                goal.id === goalId ? { ...goal, current: newProgress } : goal
              ),
            };
          }
          return quest;
        });
        void persist(next, activeQuestId);
        return next;
      });
    },
    [activeQuestId, persist]
  );

  const isQuestCompletedToday = useCallback(
    (questId: string): boolean => {
      const today = getTodayLocalDateString();
      if (questCompletion[questId] !== today) {
        return false;
      }

      const quest = quests.find((q) => q.id === questId);
      if (!quest) {
        return false;
      }
      const allGoalsMet = quest.goals.every((g) => g.current >= g.target);

      return allGoalsMet;
    },
    [questCompletion, quests]
  );

  const completeQuest = useCallback(
    async (questId: string) => {
      const today = getTodayLocalDateString();
      const newCompletion = { ...questCompletion, [questId]: today };
      setQuestCompletion(newCompletion);
      await saveObject(QUEST_COMPLETION_KEY, newCompletion);
    },
    [questCompletion]
  );

  const uncompleteQuest = useCallback(
    async (questId: string) => {
      const newCompletion = { ...questCompletion };
      delete newCompletion[questId];
      setQuestCompletion(newCompletion);
      await saveObject(QUEST_COMPLETION_KEY, newCompletion);
    },
    [questCompletion]
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
      updateGoalProgress,
      isQuestCompletedToday,
      completeQuest,
      uncompleteQuest,
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
      updateGoalProgress,
      isQuestCompletedToday,
      completeQuest,
      uncompleteQuest,
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
