function loadLiveAuctions() {
    fetch('/api/auctions')
      .then(res => res.json())
      .then(data => {
        const container = document.getElementById('auction-container');
        if (!container) return;
        container.innerHTML = data.map(auction => `
          <div class="col">
            <div class="card h-100">
              <div class="card-body">
                <h5 class="card-title">${auction.title}</h5>
                <p class="card-text">
                  Quantity: ${auction.quantity} ${auction.unit}<br>
                  Current Bid: $${auction.currentBid || auction.minBid}<br>
                  Closing: ${new Date(auction.closingDate).toLocaleString()}
                </p>
              </div>
              <div class="card-footer">
                <input type="number" class="form-control d-inline-block w-50" min="${(auction.currentBid || auction.minBid) + 0.01}" step="0.01">
                <button class="btn btn-success bid-btn" data-auction-id="${auction._id}">Place Bid</button>
                <div class="timer mt-2" id="timer-${auction._id}"></div>
              </div>
            </div>
          </div>
        `).join('');
        data.forEach(auction => initializeCountdown(auction._id, auction.closingDate));
      });
  }