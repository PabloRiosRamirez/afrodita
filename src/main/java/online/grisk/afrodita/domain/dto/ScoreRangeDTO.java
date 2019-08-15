package online.grisk.afrodita.domain.dto;

public class ScoreRangeDTO {

	private Long idScoreRange;

	private short upperLimit;

	private short lowerLimit;

	private String color;

	public Long getIdScoreRange() {
		return idScoreRange;
	}

	public void setIdScoreRange(Long idScoreRange) {
		this.idScoreRange = idScoreRange;
	}

	public short getUpperLimit() {
		return upperLimit;
	}

	public void setUpperLimit(short upperLimit) {
		this.upperLimit = upperLimit;
	}

	public short getLowerLimit() {
		return lowerLimit;
	}

	public void setLowerLimit(short lowerLimit) {
		this.lowerLimit = lowerLimit;
	}

	public String getColor() {
		return color;
	}

	public void setColor(String color) {
		this.color = color;
	}

}
