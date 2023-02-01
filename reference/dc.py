def dc(highs, lows, period):
	upper = []
	lower = []
	middle = []
	for i in range(len(highs)):
		if i < period - 1:
			upper.append(None)
			lower.append(None)
			middle.append(None)
		else:
			upper.append(max(highs[i-period+1:i+1]))
			lower.append(min(lows[i-period+1:i+1]))
			middle.append((upper[-1] + lower[-1]) / 2)
	return upper, lower, middle

def dc2(highs, lows, period):
	
	upper = []
	lower = []
	middle = []

	for i in range(period-1, len(highs)):
		upper.append(max(highs[i-period+1:i+1]))
		lower.append(min(lows[i-period+1:i+1]))
		middle.append((upper[-1] + lower[-1]) / 2)

	return upper, lower, middle