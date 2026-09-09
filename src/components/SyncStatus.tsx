import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
let NetInfo: any = null;
try {
  // try both package names
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  NetInfo = require('@react-native-netinfo/netinfo');
} catch (e1) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    NetInfo = require('@react-native-community/netinfo');
  } catch (e2) {
    NetInfo = null;
  }
}
import { loadQueue } from '../utils/syncQueue';

const SyncStatus: React.FC = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [queueLength, setQueueLength] = useState(0);

  useEffect(() => {
    let unsubscribe: any = null;
    if (NetInfo && NetInfo.addEventListener) {
      unsubscribe = NetInfo.addEventListener((state: any) => {
        setIsConnected(!!state.isConnected);
      });
    } else {
      setIsConnected(true);
    }

    const refresh = async () => {
      try {
        const q = await loadQueue();
        setQueueLength(q.length);
      } catch {
        setQueueLength(0);
      }
    };

    // initial
    void refresh();
    const iv = setInterval(refresh, 5000);

    return () => {
      if (unsubscribe) unsubscribe();
      clearInterval(iv);
    };
  }, []);

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: isConnected ? '#10B981' : '#EF4444' }]} />
      {queueLength > 0 && (
        <View style={styles.queueBadge}>
          <Text style={styles.queueText}>{queueLength}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  queueBadge: {
    backgroundColor: '#F59E0B',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  queueText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
});

export default SyncStatus;
