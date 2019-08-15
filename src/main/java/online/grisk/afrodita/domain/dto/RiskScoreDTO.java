package online.grisk.afrodita.domain.dto;

import java.util.Collection;
import java.util.Date;

public class RiskScoreDTO {

	private Long idScore;

	private long organization;

	private String titule;

	private String variable;

	private boolean enabled;

	private Date createdAt;

	private Collection<ScoreRangeDTO> scoreRangeCollection;

	public Long getIdScore() {
		return idScore;
	}

	public void setIdScore(Long idScore) {
		this.idScore = idScore;
	}

	public long getOrganization() {
		return organization;
	}

	public void setOrganization(long organization) {
		this.organization = organization;
	}

	public String getTitule() {
		return titule;
	}

	public void setTitule(String titule) {
		this.titule = titule;
	}

	public String getVariable() {
		return variable;
	}

	public void setVariable(String variable) {
		this.variable = variable;
	}

	public boolean isEnabled() {
		return enabled;
	}

	public void setEnabled(boolean enabled) {
		this.enabled = enabled;
	}

	public Date getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Date createdAt) {
		this.createdAt = createdAt;
	}

	public Collection<ScoreRangeDTO> getScoreRangeCollection() {
		return scoreRangeCollection;
	}

	public void setScoreRangeCollection(Collection<ScoreRangeDTO> scoreRangeCollection) {
		this.scoreRangeCollection = scoreRangeCollection;
	}

}